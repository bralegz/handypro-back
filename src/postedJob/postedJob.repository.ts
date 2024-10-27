import { BadRequestException, Injectable } from '@nestjs/common';
import { PostedJob } from './postedJob.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { Category } from '../category/category.entity';
import { Application } from '../application/application.entity';
import { Location } from '../location/location.entity';

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

        const postedJobsArray = postedJobs.map(({ applications, ...job }) => {
            const categoryNames = job.categories.map(
                (category) => category.name,
            );

            return {
                ...job,
                applications: applications.map((app) => ({
                    status: app.status,
                    professional: {
                        id: app.professional.id,
                        fullname: app.professional.fullname,
                        profileImg: app.professional.profileImg,
                        rating: app.professional.rating,
                        years_experience: app.professional.years_experience,
                        availability: app.professional.availability,
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

    async findByCategory(category: string) {
        //Se divide el string y formamos un array de strings
        const professionArray = category
            .split(',')
            .map((category) => category.trim());

        // Busca las categorías basadas en el array de profesiones
        const categories = await this.categoriesRepository.find({
            where: { name: In(professionArray) },
        });

        // Obtiene los ids de las categorias
        const categoryIds = categories.map((category) => category.id);

        // Busca los postedJobs que tienen las categorías encontradas
        const postedJobs = await this.postedJobRepository.find({
            where: {
                categories: {
                    id: In(categoryIds),
                },
            },
            relations: {
                client: true,
                review: true,
                location: true,
                categories: true,
                applications: {
                    professional: true,
                },
            },
            select: {
                review: { rating: true, comment: true },
                client: {
                    id: true,
                    fullname: true,
                },
            },
        });

        const postedJobsArray = postedJobs.map(({ applications, ...job }) => {
            const categoryNames = job.categories.map(
                (category) => category.name,
            );

            return {
                ...job,
                applications: applications.map((app) => ({
                    status: app.status,
                    professional: {
                        id: app.professional.id,
                        fullname: app.professional.fullname,
                        profileImg: app.professional.profileImg,
                        rating: app.professional.rating,
                        years_experience: app.professional.years_experience,
                        availability: app.professional.availability,
                    },
                })),
                location: job.location.name,
                categories: categoryNames,
            };
        });

        return postedJobsArray;
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

        if(!postedJobCategory.length) throw new Error('La categoría no existe');

        //Get location entity
        const postedJobLocation = await this.locationRepository.find({
            where: { name: location },
        });

        if(!postedJobLocation.length) throw new Error('La ubicación no existe');

        //Get client entity
        const postedJobClient = await this.usersRepository.find({
            where: { id: clientId },
        });

        if(!postedJobClient.length) throw new Error('El cliente no existe');

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

        return postedJobCreated;
    }
}
