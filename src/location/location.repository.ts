import { BadRequestException, Injectable } from '@nestjs/common';
import * as location from '../utils/location.json';
import { Location } from './location.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class LocationRepository {
    constructor(
        @InjectRepository(Location)
        private readonly locationRepository: Repository<Location>,
    ) {}
    findAll() {
        if (!location || !location.locations) {
            throw new BadRequestException('locations not found');
        }
        return location.locations;
    }

    getAllLocations() {
        const locations = this.locationRepository.find();

        return locations;
    }
}
