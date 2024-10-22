import { Module } from '@nestjs/common';
import { PostedJobService } from './postedJob.service';
import { PostedJobController } from './postedJob.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostedJob } from './postedJob.entity';
import { PostedJobRepository } from './postedJob.repository';

@Module({
    imports: [TypeOrmModule.forFeature([PostedJob])],
    controllers: [PostedJobController],
    providers: [PostedJobService, PostedJobRepository],
    exports: [TypeOrmModule],
})
export class PostedJobModule {}
