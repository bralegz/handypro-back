import { Injectable, Logger } from '@nestjs/common';
import * as category from './utils/category.json';
import * as location from './utils/location.json';
import * as users from './utils/users.json';
import * as reviews from './utils/reviews.json';
import * as postedJobs from './utils/posted_job.json';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category/category.entity';
import { Location } from './location/location.entity';
import { User } from './user/user.entity';
import { Review } from './review/review.entity';
import { PostedJob } from './postedJob/postedJob.entity';

@Injectable()
export class PreloadService {
    private readonly logger = new Logger(PreloadService.name);

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
        @InjectRepository(Location)
        private readonly locationRepository: Repository<Location>,
        @InjectRepository(Review)
        private readonly reviewRepository: Repository<Review>,
        @InjectRepository(PostedJob)
        private readonly postedJobRepository: Repository<PostedJob>,
    ) {}

    async preloadData() {
        // Cargar categories
        const categories = category.categories.map(({ id, name }) => ({
            name,
        }));
        const existingCategories = await this.categoryRepository.find();
        if (existingCategories.length === 0) {
            await this.categoryRepository.save(categories);
            this.logger.log('Se han cargado las categorías a la base de datos');
        } else {
            this.logger.log('Ya la base de datos tiene las categorías');
        }

        // Cargar locations
        const locations = location.locations.map(({ name }) => ({ name }));
        const existingLocations = await this.locationRepository.find();
        if (existingLocations.length === 0) {
            await this.locationRepository.save(locations);
            this.logger.log(
                'Se han cargado las ubicaciones a la base de datos',
            );
        } else {
            this.logger.log('Ya la base de datos tiene las ubicaciones');
        }

        // Cargar users
        const usersData = await Promise.all(
            users.users.map(async (user) => {
                const professionArray = Array.isArray(user.profession)
                    ? user.profession
                    : [];
                const categories = await Promise.all(
                    professionArray.map(async (categoryName) => {
                        const category = await this.categoryRepository.findOne({
                            where: { name: categoryName },
                        });
                        return category;
                    }),
                );
                const location = await this.locationRepository.findOne({
                    where: { name: user.location },
                });

                return {
                    email: user.contact.email,
                    fullname: user.name,
                    password: user.password,
                    phone: user.contact.phone,
                    profileImg: user.profile_picture,
                    role: user.role,
                    rating: user.rating,
                    services: user.services,
                    availability: user.availability,
                    bio: user.bio,
                    portfolio_gallery: user.portfolio_gallery,
                    years_experience: user.experience,
                    categories: categories.filter((category) => category),
                    location: location || null,
                };
            }),
        );
        const existingUsers = await this.userRepository.find();
        if (existingUsers.length === 0) {
            await this.userRepository.save(usersData);
            this.logger.log('Se han cargado los usuarios a la base de datos');
        } else {
            this.logger.log('Ya la base de datos tiene los usuarios');
        }

        // Cargar reviews
        const reviewsData = reviews.reviews.map((review) => ({
            rating: review.rating,
            comment: review.comment,
        }));
        const existingReviews = await this.reviewRepository.find();
        if (existingReviews.length === 0) {
            await this.reviewRepository.save(reviewsData);
            this.logger.log('Se han cargado las reseñas a la base de datos');
        } else {
            this.logger.log('Ya la base de datos tiene las reseñas');
        }

        // Cargar postedJobs

        const existingJobs = await this.postedJobRepository.find();
        if (existingJobs.length > 0) {
            this.logger.warn(
                'Ya existen trabajos publicados en la base de datos. No se cargarán nuevos trabajos.',
            );
            return 'Proceso de pre-carga cancelado debido a datos existentes.';
        }

        for (const job of postedJobs.posted_jobs) {
            let postedJob = new PostedJob();

            // Asignar el profesional
            const profEmail = users.users.find(
                (user) => user.id === job.professional,
            )?.contact.email;
            if (profEmail) {
                const professional = await this.userRepository.findOne({
                    where: { email: profEmail },
                });
                if (professional) {
                    postedJob.professional = professional;
                }
            }

            // Asignar el cliente
            const clientEmail = users.users.find(
                (user) => user.id === job.client,
            )?.contact.email;
            if (clientEmail) {
                const client = await this.userRepository.findOne({
                    where: { email: clientEmail },
                });
                if (client) {
                    postedJob.client = client;
                }
            }

            // Asignar la reseña
            const reviewComment = reviews.reviews.find(
                (review) => review.review_id === job.review?.review_id,
            )?.comment;
            if (reviewComment) {
                const review = await this.reviewRepository.findOne({
                    where: { comment: reviewComment },
                });
                if (review) {
                    postedJob.review = review;
                }
            }

            // Asignar la ubicación
            const locationName = location.locations.find(
                (loc) => loc.name === job.location?.name,
            )?.name;
            if (locationName) {
                const locationEntity = await this.locationRepository.findOne({
                    where: { name: locationName },
                });
                if (locationEntity) {
                    postedJob.location = locationEntity;
                }
            }

            // Asignar las categorías
            const categoriesToAssign = [];
            for (const catId of job.categories.map((cat) => cat.id)) {
                const categoryName = category.categories.find(
                    (cat) => cat.id === catId,
                )?.name;
                if (categoryName) {
                    const categoryEntity =
                        await this.categoryRepository.findOne({
                            where: { name: categoryName },
                        });
                    if (categoryEntity) {
                        categoriesToAssign.push(categoryEntity);
                    }
                }
            }
            postedJob.categories = categoriesToAssign;

            // Asignar otros campos
            postedJob.description = job.posted_job_description;
            postedJob.date = job.posted_job_date;
            postedJob.priority = job.posted_job_priority;

            // Asegúrate de que posted_job_photos sea un arreglo
            if (Array.isArray(job.posted_job_photos)) {
                postedJob.photos = job.posted_job_photos; // Asigna directamente el arreglo
            } else {
                postedJob.photos = []; // Si no es un arreglo, asigna un arreglo vacío
            }
            postedJob.status = job.posted_job_status;

            // Guardar el trabajo publicado en la base de datos
            await this.postedJobRepository.save(postedJob);
        }

        this.logger.log(
            'Se han cargado los trabajos publicados a la base de datos',
        );
        return 'Proceso de pre-carga completado';
    }
}
