import { BadRequestException, Injectable } from '@nestjs/common';
import { PostedJob } from './postedJob.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';

@Injectable()
export class PostedJobRepository {
    constructor(
        @InjectRepository(PostedJob)
        private postedJobRepository: Repository<PostedJob>,
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) {}

    async findAll(): Promise<PostedJob[]> {
        return await this.postedJobRepository.find({
            relations: {
                client: true,
                professional: true,
                review: true,
                location: true,
                categories: true,
            },
        });
    }

    async acceptedJobsByProfessional(
        professionalId: string,
    ): Promise<PostedJob[]> {
        const user = await this.usersRepository.findOneBy({
            id: professionalId,
        });

        if (!user) throw new BadRequestException('El usuario no existe');

        const acceptedJobs = await this.postedJobRepository.find({
            where: {
                professional: {
                    id: professionalId,
                },
            },
            relations: {
                client: true,
                professional: true,
                review: true,
                location: true,
                categories: true,
            },
            select: {
                categories: { name: true },
                location: { name: true },
                review: { rating: true, comment: true },
            },
        });

        return acceptedJobs;
    }

    async postedJobsByClient(clientId: string): Promise<PostedJob[]> {
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
            relations: {
                client: true,
                professional: true,
                review: true,
                location: true,
                categories: true,
            },
            select: {
                categories: { name: true },
                location: { name: true },
                review: { rating: true, comment: true },
            },
        });

        return postedJobs;
    }

    async findJob(id: string) {
        const postedJob = await this.postedJobRepository.findOne({
            where: { id },
            relations: {
                client: true,
                professional: true,
                review: true,
                location: true,
                categories: true,
            },
        });

        return postedJob;
    }
}
