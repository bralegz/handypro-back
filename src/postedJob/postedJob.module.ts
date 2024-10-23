import { Module } from '@nestjs/common';
import { PostedJobService } from './postedJob.service';
import { PostedJobController } from './postedJob.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostedJob } from './postedJob.entity';
import { PostedJobRepository } from './postedJob.repository';
import { User } from 'src/user/user.entity';
import { Category } from 'src/category/category.entity';

@Module({
    imports: [TypeOrmModule.forFeature([PostedJob, User, Category])],
    controllers: [PostedJobController],
    providers: [PostedJobService, PostedJobRepository],
    exports: [TypeOrmModule],
})
export class PostedJobModule {}
