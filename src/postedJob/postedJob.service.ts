import { Injectable } from '@nestjs/common';
import * as Data from '../utils/data.json';
import { PostedJobRepository } from './postedJob.repository';

@Injectable()
export class PostedJobService {
    constructor(private readonly postedJobRepository: PostedJobRepository) {}

    findAll() {
        return Data.requested_jobs;
    }

    async findJob(id: string) {
        const postedJob = await this.postedJobRepository.findJob(id);
        return postedJob;
    }

    findByProfession(profession: string) {
        const categories = Data.categories;

        const isValid = categories.findIndex((category) => {
            return category.name.toLowerCase() === profession.toLowerCase();
        });

        if (isValid === -1) {
            return 'No se encontro la profesion';
        }

        return Data.requested_jobs.filter((post) => {
            return (
                post.requested_professional.toLowerCase() ===
                profession.toLowerCase()
            );
        });
    }
}
