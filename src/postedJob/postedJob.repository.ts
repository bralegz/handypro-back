import { Injectable } from '@nestjs/common';
import { PostedJob } from './postedJob.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PostedJobRepository {
    constructor(
        @InjectRepository(PostedJob)
        private readonly postedJobRepository: Repository<PostedJob>,
    ) {}

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
