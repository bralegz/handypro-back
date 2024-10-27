import { BadRequestException, Injectable } from '@nestjs/common';
import { PostedJobRepository } from './postedJob.repository';

@Injectable()
export class PostedJobService {
    constructor(private readonly postedJobRepository: PostedJobRepository) {}

    async findAll() {
        return this.postedJobRepository.findAll();
    }

    async postedJobsByClient(clientId: string) {
        try {
            const postedJobs =
                await this.postedJobRepository.postedJobsByClient(clientId);

            if (postedJobs.length === 0) {
                throw new Error('Este cliente no tiene trabajos postedos');
            }

            return postedJobs;
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    async findJob(id: string) {
        try {
            const postedJob = await this.postedJobRepository.findJob(id);

            if (!postedJob) {
                throw new Error('Este trabajo no ha sido posteado');
            }

            return postedJob;
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    async findByCategory(category: string) {
        try {
            const postedJobs =
                await this.postedJobRepository.findByCategory(category);

            if (postedJobs.length === 0) {
                throw new Error('No se encuentran posteos con esta profesión');
            }

            return postedJobs;
        } catch (error) {
            throw new BadRequestException(error.message);
        }
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
        try {
            const newJob = await this.postedJobRepository.createPostedJob(
                clientId,
                title,
                description,
                location,
                priority,
                category,
                photo,
            );

            return newJob;
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }
}
