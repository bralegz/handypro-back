import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Application } from './application.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/user.entity';
import { PostedJob } from 'src/postedJob/postedJob.entity';
import { ApplicationStatusEnum } from './enums/applicationStatus.enum';
import { PostedJobStatusEnum } from 'src/postedJob/enums/postedJobStatus.enum';

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

        if (applicationsArray.length === 0)
            throw new BadRequestException(
                'No se encontraron aplicaciones realizadas',
            );

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
                            id: postedJob.client?.id,
                            fullname: postedJob.client?.fullname,
                        },
                        location: postedJob.location?.name,
                        review: {
                            rating: postedJob.review?.rating,
                            comment: postedJob.review?.comment,
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
            relations: {
                categories: true,
                applications: {
                    professional: true,
                },
                client: true,
            },
        });

        const applicationExists = postedJob.applications.find((app) => {
            return app.professional.id === professionalId;
        });

        if (!postedJob) throw new Error('El trabajo posteado no existe');

        if (applicationExists) throw new Error('Ya postulaste a este trabajo');

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

        let hasCategory = false;
        for (let i = 0; i < professionalCategories.length; i++) {
            if (postedJobCategories.includes(professionalCategories[i])) {
                hasCategory = true;
                break;
            }
        }

        if (!hasCategory) {
            throw new Error(
                'La categoria del profesional y del trabajo deben coincidir',
            );
        }

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

    async acceptApplication(applicationId: string) {
        const application = await this.applicationsRepository.findOne({
            where: { id: applicationId },
            relations: {
                professional: true,
                postedJob: {
                    applications: true,
                },
            },
        });

        if (!application) throw new Error('La aplicación no existe');

        if (application.status === ApplicationStatusEnum.ACCEPTED)
            throw new Error('La aplicación ya fue aceptada');

        // Cambiar el estado de la aplicación a aceptada
        application.status = ApplicationStatusEnum.ACCEPTED;
        await this.applicationsRepository.save(application);

        // Cambiar el estado del trabajo posteado a 'en progreso'
        const postedJob = await this.postedJobsRepository.findOne({
            where: { id: application.postedJob.id },
        });

        if (postedJob.status !== PostedJobStatusEnum.PENDING)
            throw new Error(
                'El trabajo debe estar pendiente para poder aceptar una aplicación nueva',
            );

        postedJob.status = PostedJobStatusEnum.PROGRESS;

        await this.postedJobsRepository.save(postedJob);

        const postedJobApplicationsId = application.postedJob.applications.map(
            (app) => app.id,
        );

        // Rechazar todas las aplicaciones del trabajo posteado menos la aceptada
        postedJobApplicationsId.forEach(async (app) => {
            if (app !== application.id) {
                const application = await this.applicationsRepository.findOne({
                    where: { id: app },
                });

                application.status = ApplicationStatusEnum.REJECTED;

                await this.applicationsRepository.save(application);
            }
        });

        return {
            id: application.id,
            status: application.status,
            professional: {
                id: application.professional.id,
                fullname: application.professional.fullname,
                rating: application.professional.rating,
                services: application.professional.services,
            },
            postedJob: {
                id: application.postedJob.id,
                title: application.postedJob.title,
            },
        };
    }
}
