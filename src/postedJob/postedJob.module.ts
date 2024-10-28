import { Module } from '@nestjs/common';
import { PostedJobService } from './postedJob.service';
import { PostedJobController } from './postedJob.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostedJob } from './postedJob.entity';
import { PostedJobRepository } from './postedJob.repository';
import { User } from '../user/user.entity';
import { Category } from '../category/category.entity';
import { Application } from '../application/application.entity';
import { Location } from '../location/location.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            PostedJob,
            User,
            Category,
            Application,
            Location,
        ]),
    ],
    controllers: [PostedJobController],
    providers: [PostedJobService, PostedJobRepository],
    exports: [TypeOrmModule],
})
export class PostedJobModule {}
