import { BadRequestException, Injectable } from '@nestjs/common';
import * as Data from '../utils/data.json';
import { PostedJobRepository } from './postedJob.repository';
import { PostedJob } from './postedJob.entity';

@Injectable()
export class PostedJobService {
    constructor(private readonly postedJobRepository: PostedJobRepository) {}

    async findAll(): Promise<PostedJob[]> {
        return this.postedJobRepository.findAll();
    }

    async acceptedJobsByProfessional(
        professionalId: string,
    ): Promise<PostedJob[]> {
        try {
            const acceptedJobs =
                await this.postedJobRepository.acceptedJobsByProfessional(
                    professionalId,
                );

            if (acceptedJobs.length === 0) {
                throw new Error('Este profesional no tiene trabajos aceptados');
            }

            return acceptedJobs;
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    async postedJobsByClient(clientId: string): Promise<PostedJob[]> {
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

    async findByCategory(category: string): Promise<PostedJob[]> {
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
}
