import { BadRequestException, Injectable } from '@nestjs/common';
import { PostedJob } from './postedJob.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { Category } from 'src/category/category.entity';
import { Application } from 'src/application/application.entity';

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
}
