import { Injectable } from '@nestjs/common';
import { SignupUserDto } from './dtos/signupUser.dto';
import { Repository } from 'typeorm';
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

    async getProfessionals(professions: string, page: number, limit: number) {
        const users = await this.userRepository.find({
            where: { role: 'professional' },
            relations: {
                acceptedJobs: { review: true },
                categories: true,
                location: true,
            },
            skip: (page - 1) * limit,
            take: limit,
        });

        const usersMapped = users.map((user) => {
            //return array with categories name
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

        // const users = await this.userRepository.find({
        //     where: { role: 'client' },
        // });
        // return users;
    }

}
