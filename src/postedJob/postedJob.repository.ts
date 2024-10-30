import { BadRequestException, Injectable } from '@nestjs/common';
import { PostedJob } from './postedJob.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { Category } from '../category/category.entity';
import { Application } from '../application/application.entity';
import { Location } from '../location/location.entity';
import { PostedJobStatusEnum } from './enums/postedJobStatus.enum';

@Injectable()
export class PostedJobRepository {
    constructor(
        @InjectRepository(PostedJob)
        private postedJobRepository: Repository<PostedJob>,
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        @InjectRepository(Category)
        private categoriesRepository: Repository<Category>,
        @InjectRepository(Application)
        private applicationsRepository: Repository<Application>,
        @InjectRepository(Location)
        private locationRepository: Repository<Location>,
    ) {}

    async findAll() {
        const postedJobs = await this.postedJobRepository.find({
            relations: {
                client: true,
                review: true,
                location: true,
                categories: true,
                applications: {
                    professional: true,
                },
            },
            order: {
                applications: {
                    professional: {
                        rating: 'DESC',
                    },
                },
            },
        });

        const postedJobsArray = postedJobs.map((job) => {
            const categoryNames = job.categories?.map(
                (category) => category.name,
            );

            return {
                ...job,
                location: job.location?.name,
                categories: categoryNames,
            };
        });

        return postedJobsArray;
    }

    async postedJobsByClient(clientId: string) {
        const user = await this.usersRepository.findOneBy({
            id: clientId,
        });

        if (!user) throw new BadRequestException('El usuario no existe');

        const postedJobs = await this.postedJobRepository.find({
            where: {
                client: {
                    id: clientId,
                },
            },
            relations: [
                'review',
                'location',
                'categories',
                'applications',
                'applications.professional',
            ],
            select: {
                review: { rating: true, comment: true },
            },
        });

        if (postedJobs.length === 0)
            throw new BadRequestException(
                'No se encuentran posteos realizados.',
            );

        const postedJobsArray = postedJobs.map(({ applications, ...job }) => {
            const categoryNames = job.categories.map(
                (category) => category.name,
            );

            return {
                ...job,
                applications: applications?.map((app) => ({
                    status: app.status,
                    professional: {
                        id: app.professional?.id,
                        fullname: app.professional?.fullname,
                        profileImg: app.professional?.profileImg,
                        rating: app.professional?.rating,
                        years_experience: app.professional?.years_experience,
                        availability: app.professional?.availability,
                    },
                })),
                location: job.location.name,
                categories: categoryNames,
            };
        });

        return postedJobsArray;
    }

    async findJob(id: string) {
        const postedJob = await this.postedJobRepository.findOne({
            where: { id },
            relations: {
                client: true,
                review: true,
                location: true,
                categories: true,
                applications: {
                    professional: true,
                },
            },
        });

        return postedJob;
    }

    async postedJobsForProfessionals(idProfessional: string) {
        const user = await this.usersRepository.findOne({
            where: {
                id: idProfessional,
            },
            relations: {
                categories: true,
            },
        });

        if (!user) throw new BadRequestException('El usuario no existe');

        // Verificar que user.categories no sea null o vacío antes de mapear
        const categoryIds = user.categories?.map((cat) => cat.id) || [];
        if (categoryIds.length === 0) {
            throw new BadRequestException(
                'El profesional no tiene categorías asociadas',
            );
        }

        //Traer todos los posted jobs que coincidan con la categoria del profesional
        const postedJobs = await this.postedJobRepository.find({
            where: {
                categories: {
                    id: In(categoryIds),
                },
            },
            relations: {
                applications: {
                    professional: {
                        location: true,
                    },
                },
                categories: true,
                client: true,
                location: true,
            },
        });

        const postedJobsArray = postedJobs.map((job) => {
            return {
                ...job,
                applications: job.applications?.map((app) => ({
                    id: app.id,
                    status: app.status,
                    professional: {
                        id: app.professional?.id,
                        fullname: app.professional?.fullname,
                        profileImg: app.professional?.profileImg,
                        rating: app.professional?.rating,
                        years_experience: app.professional?.years_experience,
                        availability: app.professional?.availability,
                        location: {
                            id: app.professional?.location?.id,
                            name: app.professional?.location.name,
                        },
                    },
                })),
                client: {
                    id: job.client?.id,
                    fullname: job.client?.fullname,
                    profileImg: job.client?.profileImg,
                    role: job.client?.role,
                    availability: job.client?.availability,
                },
                location: job.location,
            };
        });

        //Traer todos los posted jobs a los que el profesional no haya aplicado
        const postedJobsForProfessional = postedJobsArray.filter((post) => {
            return post.applications.every(
                (app) => app.professional?.id !== idProfessional,
            );
        });

        //traer todos los postedjobs a los que el profesional no haya aplicado y que tengan el status pendiente y ordenados por prioridad
        const postedJobsForStatus = postedJobsForProfessional
            .filter((post) => post.status === PostedJobStatusEnum.PENDING)
            .sort((a, b) => {
                const priorityOrder = { alta: 1, media: 2, baja: 3 };
                return priorityOrder[a.priority] - priorityOrder[b.priority];
            });

        return postedJobsForStatus;
    }

    async createPostedJob(
        clientId: string,
        title: string,
        description: string,
        location: string,
        priority: string,
        category: string,
        photo: string,
    ) {
        //Get date
        const currentDate = new Date();
        const postedJobdate = currentDate.toISOString().split('T')[0];

        //Get category entity
        const postedJobCategory = await this.categoriesRepository.find({
            where: { name: category },
        });

        if (!postedJobCategory.length)
            throw new Error('La categoría no existe');

        //Get location entity
        const postedJobLocation = await this.locationRepository.find({
            where: { name: location },
        });

        if (!postedJobLocation.length)
            throw new Error('La ubicación no existe');

        //Get client entity
        const postedJobClient = await this.usersRepository.find({
            where: { id: clientId },
        });

        if (!postedJobClient.length) throw new Error('El cliente no existe');

        const postedJobCreated = this.postedJobRepository.create({
            title,
            client: postedJobClient[0],
            description: description,
            location: postedJobLocation[0],
            date: postedJobdate,
            priority,
            photos: [photo],
            categories: postedJobCategory,
        });

        await this.postedJobRepository.save(postedJobCreated);

        const locationName = postedJobCreated.location.name;
        const categoryName = postedJobCreated.categories[0].name;
        const { id, email, fullname, profileImg } = postedJobCreated.client;
        return {
            ...postedJobCreated,
            client: { id, email, fullname, profileImg },
            location: locationName,
            categories: categoryName,
        };
    }

    async completeJob(postedJobId: string) {
        const postedJob = await this.postedJobRepository.findOne({
            where: { id: postedJobId },
        });

        if (!postedJob) throw new Error('El trabajo posteado no existe');
        // console.log(postedJob.status);

        if (postedJob.status !== PostedJobStatusEnum.PROGRESS)
            throw new Error(
                'El trabajo debe estar en progreso para completarlo',
            );

        postedJob.status = PostedJobStatusEnum.COMPLETED;

        await this.postedJobRepository.save(postedJob);

        return postedJob;
    }
}
