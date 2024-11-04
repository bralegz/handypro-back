import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Review } from './review.entity';
import { PostedJob } from 'src/postedJob/postedJob.entity';
import { CreateReview } from './dtos/createReview.dto';
import { User } from 'src/user/user.entity';
import { PostedJobStatusEnum } from 'src/postedJob/enums/postedJobStatus.enum';
import { ApplicationStatusEnum } from 'src/application/enums/applicationStatus.enum';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class ReviewRepository {
    constructor(
        @InjectRepository(Review)
        private reviewsRepository: Repository<Review>,
        @InjectRepository(PostedJob)
        private postedJobsRepository: Repository<PostedJob>,
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private readonly mailService: MailService,
    ) {}

    async createReviews(review: CreateReview, postedId: string) {
        const postedJob = await this.postedJobsRepository.findOne({
            where: { id: postedId },
            relations: {
                applications: {
                    professional: true,
                },
                client: true,
                review: true,
            },
        });

        if (!postedJob)
            throw new NotFoundException('El trabajo posteado no existe');

        if (postedJob.status !== PostedJobStatusEnum.COMPLETED)
            throw new BadRequestException(
                'Debe indicar que el trabajo se completó para escribir una reseña',
            );

        const newReview = await this.reviewsRepository.create({
            rating: review.rating,
            comment: review.comment,
        });

        if (postedJob.review === null) {
            await this.reviewsRepository.save(newReview);
        }

        postedJob.review = newReview;
        await this.postedJobsRepository.save(postedJob);
        
        // Filtro por las aplicaciones que hayan sido aceptas
        const appsfiltered = postedJob.applications.filter(
            (app) => app.status === ApplicationStatusEnum.ACCEPTED,
        );

        if (appsfiltered.length === 0)
            throw new BadRequestException(
                'No se encuentran aplicaciones aceptadas',
            );

        // Busco al profesional por el id sacado de las aplicaciones aceptadas
        const professional = await this.usersRepository.findOne({
            where: {
                id: In(appsfiltered.map((app) => app.professional.id)),
            },
            relations: {
                applications: {
                    postedJob: {
                        review: true,
                    },
                },
            },
        });
        
        // Agrupo en un array los ratings de todas las reviews de las aplicaciones aceptadas que hizo
        const profesionalReviews = professional.applications
        .filter((app) => app.status === ApplicationStatusEnum.ACCEPTED)
            .map((app) => app.postedJob.review?.rating)
            .map(Number)
            .filter((rating) => !isNaN(rating));

            if (profesionalReviews.length > 0) {
                // Saco el promedio del rating
                const prom =
                profesionalReviews.reduce((acc, current) => acc + current, 0) /
                profesionalReviews.length;
                
                professional.rating = prom;
                await this.usersRepository.save(professional);
            }
            
            await this.mailService.reviewReceived(postedJob)
            
        return {
            message: 'Reseña creada con exito',
            review: newReview,
        };
    }

    async toggleActiveStatus(postedId: string) {
        const postedJob = await this.postedJobsRepository.findOne({
            where: {
                id: postedId
            },
            relations: {
                review: true,
                client: true
            }
        })

        if (!postedJob) throw new NotFoundException('El trabajo posteado no existe')

        const review = await this.reviewsRepository.findOne({
            where: {
                review_id: postedJob.review.review_id
            }
        })
        
        if (review === null) throw new NotFoundException('No existe una reseña para este trabajo')

        review.is_active = !review.is_active;
        await this.reviewsRepository.save(review)

        if (review.is_active === false) {
            await this.postedJobsRepository.save(postedJob)
            await this.mailService.deleteReview(postedJob)
        } else {
            await this.postedJobsRepository.save(postedJob)
            await this.mailService.restoreReview(postedJob)
        }

        return {
            message: 'Review eliminada exitosamente',
            postedReview: postedJob.review,
            review: review
        }
    }
}
