import {
    BadRequestException,
    Injectable,
    RequestTimeoutException,
} from '@nestjs/common';
import { SignupUserDto } from './dtos/signupUser.dto';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PostedJob } from '../postedJob/postedJob.entity';
import { Category } from '../category/category.entity';
import { UpdateUserDto } from './dtos/updateUser.dto';
import { Location } from '../location/location.entity';
import { MailService } from '../mail/mail.service';
import { UserRole } from './enums/user-role.enum';

@Injectable()
export class UserRepository {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Location)
        private readonly locationRepository: Repository<Location>,
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
        private readonly mailService: MailService,
    ) {}

    async createUser(
        newUser: SignupUserDto & { profileImg?: string; role?: UserRole },
    ) {
        if (newUser.email.endsWith('@handypro.site')) {
            newUser.role = UserRole.ADMIN;
        }
        const createdUser = this.userRepository.create(newUser);
        await this.userRepository.save(createdUser);

        // await this.mailService.sendUserWelcome(newUser);

        const { password, ...userWithoutPassword } = createdUser;
        return userWithoutPassword;
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
        name?: string,
    ) {
        const users = await this.userRepository.find({
            where: { role: 'professional', is_active: true },
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
                portfolio_gallery,
                role,
                password,
                hashedRefreshToken,
                is_active,
                ...user
            }) => {
                const categoriesMapped = user.categories.map((category) => {
                    return category?.name;
                });

                const acceptedJobs = Array.isArray(applications)
                    ? applications
                          .filter((app) => app.status === 'accepted')
                          .map((app) => app.postedJob)
                    : [];

                return {
                    ...user,
                    location: user.location?.name,
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
                is_active: true,
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

        const usersMapped = users.map(
            ({
                password,
                hashedRefreshToken,
                is_active,
                rating,
                services,
                availability,
                bio,
                portfolio_gallery,
                years_experience,
                ...user
            }) => {
                return { ...user, location: user.location?.name };
            },
        );
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
        });

        if (!user) {
            throw new BadRequestException('El usuario no existe.');
        }

        if (!user.is_active) {
            throw new BadRequestException('Este usuario se encuentra inhabilitado');
        }

        const categoryNames = user?.categories.map((category) => category.name);
        const acceptedJobs = user.applications.filter(
            (application) => application.postedJob.status === 'completado',
        );

        const { phone, password, hashedRefreshToken, is_active,...userWithoutSensitiveInfo } = user;

        return {
            ...userWithoutSensitiveInfo,
            location: user.location?.name,
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

        if (!user) {
            throw new BadRequestException('El usuario no existe.');
        }

        if (!user.is_active) {
            throw new BadRequestException('Este usuario se encuentra inhabilitado');
        }

        const { password, hashedRefreshToken, ...userWithoutSensitiveInfo } = user;

        return {
            ...userWithoutSensitiveInfo,
            location: user.location?.name,
        };
    }

    async getProfile(userId: string) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
        });

        if (!user) {
            throw new BadRequestException('El usuario no existe.');
        }

        if (!user.is_active) {
            throw new BadRequestException('Este usuario se encuentra inhabilitado');
        }

        return user;
    }

    async changeRole(userId: string, role: string) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
        });

        if (!user) {
            return user;
        }

        if (!user.is_active) {
            throw new BadRequestException('Este usuario se encuentra inhabilitado');
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

    async updateProfile(userNewInfo: UpdateUserDto, userId: string) {
        const updateUser = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['categories'],
        });

        if (!updateUser) {
            throw new Error('El usuario no existe');
        }

        if (!updateUser.is_active) {
            throw new BadRequestException('Este usuario se encuentra inhabilitado');
        }

        let location = null;
        if (userNewInfo.location) {
            location = await this.locationRepository.findOne({
                where: { name: userNewInfo.location },
            });

            if (!location) {
                throw new Error('La ubicación no existe');
            }
        }

        updateUser.fullname = userNewInfo?.fullname;
        updateUser.location = location && location;
        updateUser.phone = userNewInfo?.phone;
        updateUser.profileImg = userNewInfo?.profileImg;
        updateUser.years_experience = userNewInfo?.years_experience;
        updateUser.services = userNewInfo?.services;

        const categories =
            userNewInfo?.categories &&
            (await Promise.all(
                userNewInfo.categories.map(async (category) => {
                    const foundCategory = await this.categoryRepository.findOne(
                        { where: { name: category } },
                    );

                    if (!foundCategory) {
                        throw new Error('La categoría no existe');
                    }

                    return foundCategory;
                }),
            ));

        updateUser.categories = categories;

        await this.userRepository.save(updateUser);

        return updateUser;
    }

    async toggleUserActiveStatus(userId: string) {
        const user = await this.userRepository.findOne({ where: { id: userId } });

        if (!user) {
            throw new BadRequestException('El usuario no existe.');
        }

        user.is_active = !user.is_active;
        await this.userRepository.save(user);
        // await this.mailService.bannedUser(user) 

        return {
            id: user.id,
            fullname: user.fullname,
            email: user.email,
            is_active: user.is_active,
        };
    }

    async getInactiveUsers() {
        const users = await this.userRepository.find({
            where: { is_active: false },
            relations: ['location', 'categories', 'applications', 'applications.postedJob', 'applications.postedJob.review'],
        });

        return users.map(user => {
            const categoryNames = user?.categories?.map((category) => category.name);
            const acceptedJobs = user.applications?.filter(
                (application) => application.postedJob.status === 'completado',
            );

            const { password, hashedRefreshToken, is_active, ...userWithoutSensitiveInfo } = user;

            return {
                ...userWithoutSensitiveInfo,
                location: user.location?.name,
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
        });
    }

    async getUsersByRole(role: UserRole) {
        const users = await this.userRepository.find({
            where: { role },
        });

        return users;
    }
}
