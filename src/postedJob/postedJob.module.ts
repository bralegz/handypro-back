import { Module } from '@nestjs/common';
import { PostedJobsService } from './postedJob.service';
import { PostedJobController } from './postedJob.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostedJob } from './postedJob.entity';

@Module({
    imports: [TypeOrmModule.forFeature([PostedJob])],
    controllers: [PostedJobController],
    providers: [PostedJobsService],
    exports: [TypeOrmModule, ],
})
export class PostedJobModule {}
