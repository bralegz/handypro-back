import { BadRequestException, Injectable } from '@nestjs/common';
import * as location from '../utils/location.json';

@Injectable()
export class LocationRepository {
    findAll() {
        if (!location || !location.locations) {
            throw new BadRequestException('locations not found');
        }
        return location.locations;
    }
}
