import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './review.entity'; // Asegúrate de importar correctamente la entidad Review
import { ReviewService } from './review.service'; // Si tienes un servicio
import { ReviewController } from './review.controller'; // Si tienes un controlador

@Module({
  imports: [TypeOrmModule.forFeature([Review])],
  providers: [ReviewService],
  controllers: [ReviewController], 
  exports: [TypeOrmModule] 
})
export class ReviewsModule {}
