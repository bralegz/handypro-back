import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Application } from './application.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/user.entity';
import { PostedJob } from 'src/postedJob/postedJob.entity';
import { Category } from 'src/category/category.entity';

@Injectable()
export class ApplicationRepository {
    constructor(
        @InjectRepository(Application)
        private applicationsRepository: Repository<Application>,
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        @InjectRepository(PostedJob)
        private postedJobsRepository: Repository<PostedJob>,
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

    async createApplication(postedJobId: string, professionalId: string) {
        const postedJob = await this.postedJobsRepository.findOne({
            where: { id: postedJobId },
            relations: ['categories', 'applications', 'applications.professional'],
        });

        const applicationExists = postedJob.applications.find((app) => {
            return app.professional.id === professionalId;
        })

        if (!postedJob) throw new Error('El trabajo posteado no existe');

        if(applicationExists) throw new Error('Ya postulaste a este trabajo');

        if (postedJob.status === 'completado')
            throw new Error('El trabajo ya fue completado');

        const professional = await this.usersRepository.findOne({
            where: { id: professionalId },
            relations: {
                categories: true,
            },
        });

        if (!professional) throw new Error('El profesional no existe');

        const postedJobCategories = postedJob.categories.map(
            (category) => category.name,
        );

        const professionalCategories = professional.categories.map(
            (category) => category.name,
        );

        professionalCategories.forEach((category) => {
            if (!postedJobCategories.includes(category)) {
                throw new Error(
                    'La categoria del profesional y del trabajo deben coincidir',
                );
            }
        });

        const application = this.applicationsRepository.create({
            postedJob,
            professional,
        });

        await this.applicationsRepository.save(application);

        const { id: workerId, fullname } = application.professional;
        const { id: jobId, title } = application.postedJob;

        return {
            ...application,
            professional: { id: workerId, fullname },
            postedJob: { id: jobId, title },
        };
    }
}
