import { Injectable } from '@nestjs/common';
import { LocationRepository } from './location.repository';

@Injectable()
export class LocationService {
    constructor(private readonly locationRepository: LocationRepository) {}
    getAllCategories() {
        return this.locationRepository.findAll();
    }
}
