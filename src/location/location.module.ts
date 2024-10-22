import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationController } from './location.controller';
import { LocationService } from './location.service';
import { Location } from './location.entity'; // Ajusta la ruta según tu estructura
import { LocationRepository } from './location.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Location])], 
  controllers: [LocationController],
  providers: [LocationService, LocationRepository],
  exports: [LocationRepository, TypeOrmModule], 
})
export class LocationModule {}
