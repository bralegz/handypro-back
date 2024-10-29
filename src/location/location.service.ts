import { Injectable, NotFoundException } from '@nestjs/common';
import { LocationRepository } from './location.repository';

@Injectable()
export class LocationService {
    constructor(private readonly locationRepository: LocationRepository) {}
    getAllCategories() {
        return this.locationRepository.findAll();
    }

    getAllLocations() {
        try {
            const locations = this.locationRepository.getAllLocations();
            if(!locations) {
                throw new Error('No hay ubicaciones disponibles')
            }

            return locations
        } catch (error) {
            throw new NotFoundException(error.message);
        }
    }
}
