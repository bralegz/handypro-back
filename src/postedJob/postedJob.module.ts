import { Module } from '@nestjs/common';
import { PostedJobsService } from './postedJob.service';
import { PostedJobController } from './postedJob.controller';

@Module({
    controllers: [PostedJobController],
    providers: [PostedJobsService],
})
export class PostedJobModule {}
