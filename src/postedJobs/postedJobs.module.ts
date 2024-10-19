import { Module } from '@nestjs/common';
import { PostedJobsService } from './postedJobs.service';
import { PostedJobsController } from './postedJobs.controller';

@Module({
    controllers: [PostedJobsController],
    providers: [PostedJobsService],
})
export class PostsModule {}
