import { Injectable } from '@nestjs/common';
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

    async createUser(newUser: SignupUserDto) {
        const createdUser = this.userRepository.create(newUser);
        await this.userRepository.save(createdUser);

        return createdUser;
    }

    async findUserByEmail(email: string) {
        const user = this.userRepository.findOne({ where: { email } });

        return user;
    }

    async getProfessionals(
        categories: string,
        page: number,
        limit: number,
        name: string,
        rating: number,
    ) {
        // Ordernar por Rating
        const order: any = {};

        if (rating !== 0) {
            order.rating = 'DESC'; // MAY a MEN
        } else {
            order.rating = 'ASC'; // MEN a MAY
        }

        const users = await this.userRepository.find({
            where: { role: 'professional' },
            relations: {
                acceptedJobs: { review: true },
                categories: true,
                location: true,
            },
            skip: (page - 1) * limit,
            take: limit,
            order: order,
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

        const usersMapped = filteredUsers.map((user) => {
            const categoriesMapped = user.categories.map((category) => {
                return category.name;
            });

            return {
                ...user,
                location: user.location.name,
                categories: categoriesMapped,
            };
        });

        return usersMapped;
    }

    async getClients(page: number, limit: number) {
        const users = await this.userRepository.find({
            where: { role: 'client' },
            relations: { postedJobs: { review: true }, location: true },
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
            where: { id },
            relations: {
                acceptedJobs: { review: true },
                categories: true,
                location: true,
            },
        });

        const categoryNames = user?.categories.map((category) => category.name);

        return {
            ...user,
            location: user.location.name,
            categories: categoryNames,
        };
    }
}
