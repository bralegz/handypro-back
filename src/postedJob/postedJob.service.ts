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

    async postedJobsForProfessionals(category: string, idProfessional: string) {
        try {
            const postedJobs =
                await this.postedJobRepository.postedJobsForProfessionals(
                    category,
                    idProfessional,
                );

            if (postedJobs.length === 0) {
                throw new Error(
                    'No se encuentran posteos de acuerdo a tu profesión',
                );
            }

            return postedJobs;
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }
}
