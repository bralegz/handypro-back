import { BadRequestException, Injectable } from '@nestjs/common';
import { SignupUserDto } from './dtos/signupUser.dto';
import { In, Like, Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PostedJob } from 'src/postedJob/postedJob.entity';
import { Category } from 'src/category/category.entity';

@Injectable()
export class UserRepository {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async createUser(newUser: SignupUserDto & { profileImg?: string }) {
        const createdUser = this.userRepository.create(newUser);
        await this.userRepository.save(createdUser);

        return createdUser;
    }

    async findUserByEmail(email: string) {
        const user = await this.userRepository.findOne({ where: { email } });

        console.log(user);
        return user;
    }

    async getProfessionals(
        categories: string,
        page: number,
        limit: number,
        name: string,
    ) {
        const users = await this.userRepository.find({
            where: { role: 'professional' },
            relations: {
                applications: {
                    postedJob: true,
                },
                categories: true,
                location: true,
            },
            skip: (page - 1) * limit,
            take: limit,
            order: {
                rating: 'DESC',
            },
        });

        let filteredUsers = users;

        // Filtrar por nombre
        if (name) {
            filteredUsers = filteredUsers.filter(
                (user) =>
                    user.fullname.toLowerCase().includes(name.toLowerCase()), // Filtro por nombre
            );
        }

        // Filtrar por Categorias
        if (categories) {
            const professionArray = categories
                .split(',')
                .map((category) => category.trim().toLocaleLowerCase()); // Se divide el string y formamos un array de strings

            if (professionArray.length > 0) {
                filteredUsers = filteredUsers.filter((user) =>
                    user.categories.some((category) =>
                        professionArray.includes(
                            category.name.toLocaleLowerCase(),
                        ),
                    ),
                );
            }
        }

        const usersMapped = filteredUsers.map(
            ({
                applications,
                phone,
                portfolio_gallery,
                email,
                role,
                ...user
            }) => {
                const categoriesMapped = user.categories.map((category) => {
                    return category.name;
                });

                const acceptedJobs = Array.isArray(applications)
                    ? applications
                          .filter((app) => app.status === 'accepted')
                          .map((app) => app.postedJob)
                    : [];

                return {
                    ...user,
                    location: user.location.name,
                    categories: categoriesMapped,
                    completedJobs: acceptedJobs.length,
                };
            },
        );

        return usersMapped;
    }

    async getClients(page: number, limit: number) {
        const users = await this.userRepository.find({
            where: {
                role: 'client',
            },
            relations: {
                postedJobs: {
                    review: true,
                },
                location: true,
            },
            skip: (page - 1) * limit,
            take: limit,
        });

        const usersMapped = users.map((user) => {
            return { ...user, location: user.location.name };
        });
        return usersMapped;
    }

    async getProfessionalById(id: string) {
        const user = await this.userRepository.findOne({
            where: { id, role: 'professional' },
            relations: {
                applications: {
                    postedJob: {
                        review: true,
                    },
                },
                categories: true,
                location: true,
            },
            select: {
                id: true,
                fullname: true,
                profileImg: true,
                role: true,
                rating: true,
                services: true,
                bio: true,
                availability: true,
                portfolio_gallery: true,
                years_experience: true,
                hashedRefreshToken: true,
            },
        });

        if (!user) {
            throw new BadRequestException('El usuario no existe.');
        }

        const categoryNames = user?.categories.map((category) => category.name);
        const acceptedJobs = user.applications.filter(
            (application) => application.postedJob.status === 'completado',
        );

        return {
            ...user,
            location: user.location.name,
            categories: categoryNames,
            applications: acceptedJobs.map((app) => ({
                status: app.status,
                postedJob: {
                    id: app.postedJob.id,
                    title: app.postedJob.title,
                    description: app.postedJob.description,
                    date: app.postedJob.date,
                    priority: app.postedJob.priority,
                    photos: app.postedJob.photos,
                    status: app.postedJob.status,
                    review: {
                        rating: app.postedJob.review?.rating,
                        comment: app.postedJob.review?.comment,
                    },
                },
            })),
        };
    }

    async getClientById(id: string) {
        const user = await this.userRepository.findOne({
            where: { id, role: 'client' },
            relations: { postedJobs: { review: true }, location: true },
        });

        return {
            ...user,
            location: user.location.name,
        };
    }

    async getProfile(userId: string) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
        });
        return user;
    }

    async changeRole(userId: string, role: string) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
        });

        if (!user) {
            return user;
        }

        if (role === user.role) {
            throw new Error('El usuario ya tiene este rol');
        }

        user.role = role;
        await this.userRepository.save(user);

        return { id: user.id, name: user.fullname, newRole: user.role };
    }

    async updateHashedRefreshToken(userId: string, hashedRefreshToken: string) {
        return await this.userRepository.update(
            { id: userId },
            { hashedRefreshToken },
        );
    }

    async findUserById(id: string) {
        const user = await this.userRepository.findOne({ where: { id } });

        return user;
    }
}
