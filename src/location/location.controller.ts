import { Controller, Get } from '@nestjs/common';
import { LocationService } from './location.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('locations')
@Controller('locations')
export class LocationController {
    constructor(private readonly locationService: LocationService) {}

    @Get()
    @ApiResponse({
        status: 200,
        description: 'Ubicaciones encontradas',
        example: {
            example: [
                {
                    id: 'b31f1074-07d9-4b6d-ac1b-97fc86ac9f0d',
                    name: 'San Isidro',
                },
                {
                    id: 'bda5bd24-d957-460e-a462-b183c8d9a31f',
                    name: 'Lince',
                },
                {
                    id: 'c136c159-4a75-4be2-bdab-5820c7570ad4',
                    name: 'Comas',
                },
                {
                    id: 'e4ed11b7-bd38-46da-8abd-39ac3fa1679f',
                    name: 'Miraflores',
                },
                {
                    id: '555325f9-ad49-4af4-abec-b4984457bc48',
                    name: 'Surco',
                },
                {
                    id: '31186be1-8ae0-479e-9515-8cacc91774ab',
                    name: 'La Molina',
                },
                {
                    id: '8f1a8735-b9b5-4a03-a5e7-cb8386bed456',
                    name: 'Jesus Maria',
                },
                {
                    id: '25a3c3ba-0a96-45e0-8fd8-145b1508eac7',
                    name: 'San Borja',
                },
                {
                    id: '7339118b-7d96-46bd-bfc4-887bc71fa2fa',
                    name: 'Magdalena',
                },
                {
                    id: '37498e1a-c5ec-495d-9585-a7e1dcad202e',
                    name: 'San Miguel',
                },
                {
                    id: 'c80221f9-a0d4-47b6-9cc9-fdbcf0afa19d',
                    name: 'Barranco',
                },
                {
                    id: 'b8adcc04-f1b0-4d87-85ed-8c63a02f49c0',
                    name: 'Pueblo Libre',
                },
                {
                    id: '734da611-d865-4b84-b076-9b7d372dd8bf',
                    name: 'Los Olivos',
                },
                {
                    id: '075fba10-ab10-4151-8f86-d2253888f2c6',
                    name: 'Santa Anita',
                },
                {
                    id: 'de9931aa-c9fe-4492-9c51-e3caf3b04e80',
                    name: 'La Victoria',
                },
                {
                    id: 'd0167f64-6010-4ca7-824e-c7bb51166238',
                    name: 'Chorrillos',
                },
            ],
        },
    })
    getAllLocations() {
        return this.locationService.getAllLocations();
    }
}
