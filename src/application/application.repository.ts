import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Application } from './application.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/user.entity';

@Injectable()
export class ApplicationRepository {
    constructor(
        @InjectRepository(Application)
        private applicationsRepository: Repository<Application>,
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) {}

    async applicationsByProfessional(professionalId: string) {
        const user = await this.usersRepository.findOneBy({
            id: professionalId,
        });

        if (!user) throw new BadRequestException('El usuario no existe');

        const applicationsArray = await this.applicationsRepository.find({
            where: {
                professional: {
                    id: professionalId,
                },
            },
            relations: {
                postedJob: {
                    location: true,
                    categories: true,
                    review: true,
                    client: true,
                },
            },
            order: {
                postedJob: {
                    review: {
                        rating: 'DESC',
                    },
                },
            },
        });

        // Todas las postulacion del profesional que no fueron rechazadas por el cliente
        const postedJobsAccepted = applicationsArray.filter(
            (app) => app.status !== 'rejected' && app.status !== 'pending',
        );

        const postedJobsArray = postedJobsAccepted.map(
            ({ postedJob, ...job }) => {
                return {
                    ...job,
                    postedJob: {
                        ...postedJob,
                        client: {
                            id: postedJob.client.id,
                            fullname: postedJob.client.fullname,
                        },
                        location: postedJob.location.name,
                        review: {
                            rating: postedJob.review.rating,
                            comment: postedJob.review.comment,
                        },
                        categories: postedJob.categories.map(
                            (category) => category.name,
                        ),
                    },
                };
            },
        );

        return postedJobsArray;
    }
}
