import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './review.entity'; // Asegúrate de importar correctamente la entidad Review
import { ReviewService } from './review.service'; // Si tienes un servicio
import { ReviewController } from './review.controller'; // Si tienes un controlador
import { ReviewRepository } from './review.repository';
import { PostedJob } from 'src/postedJob/postedJob.entity';
import { User } from 'src/user/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Review, PostedJob, User])],
    providers: [ReviewService, ReviewRepository],
    controllers: [ReviewController],
    exports: [TypeOrmModule],
})
export class ReviewsModule {}
