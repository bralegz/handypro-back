import {
    Controller,
    Get,
    Body,
    Param,
    ParseUUIDPipe,
    Query,
} from '@nestjs/common';
import { PostedJobService } from './postedJob.service';
import { ApiOkResponse, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('posted-jobs')
@Controller('posted-jobs')
export class PostedJobController {
    constructor(private readonly postedJobService: PostedJobService) {}

    @Get()
    findAll() {
        return this.postedJobService.findAll();
    }

    @ApiQuery({
        name: 'categories',
        required: true,
        description:
            'Si se quiere buscar por mas de una categoria debe separarlo por cómas. ES SENSIBLE A LOS ACENTOS Y MAYUSCULAS',
        example: 'Mecanico, Jardinero',
    })
    @ApiParam({
        name: 'professioanlId',
        required: true,
        description: 'Se requiere el id del profesional',
    })
    @ApiOkResponse({
        description:
            'Lista de posteos que coinciden con las categorias del profesional y ademas filtradas de acuerdo a si ya hice su postulacion o no',
        schema: {
            example: [
                {
                    id: '4b3809fb-7a03-43b3-8e2d-9472dada3111',
                    title: 'Jardín necesita amor',
                    description: 'Mantenimiento de jardín trasero',
                    date: '2024-06-28',
                    priority: 'baja',
                    photos: [
                        'https://example.com/job242_1.jpg',
                        'https://example.com/job242_2.jpg',
                    ],
                    status: 'pendiente',
                    client: {
                        id: '9a2df9c4-95b5-469f-92f9-fa2c6efa95dd',
                        fullname: 'María Rodríguez',
                    },
                    review: {
                        rating: '5.00',
                        comment:
                            'Mantenimiento de césped impecable, muy profesional.',
                    },
                    location: 'Pueblo Libre',
                    categories: ['Jardinero'],
                    applications: [
                        {
                            status: 'accepted',
                            professional: {
                                id: '2036ced0-b3d6-4c79-9812-d5499d854f5c',
                                fullname: 'Ana López',
                                profileImg:
                                    'https://i.pravatar.cc/150?u=a04258a2462d826712d',
                                rating: 3,
                                years_experience: 7,
                                availability: true,
                            },
                        },
                    ],
                },
            ],
        },
    })
    @Get('professional/:professioanlId')
    postedJobsForProfessionals(
        @Query('categories') category: string,
        @Param('professioanlId') idProfessional: string,
    ) {
        return this.postedJobService.postedJobsForProfessionals(
            category,
            idProfessional,
        );
    }

    @ApiParam({
        name: 'clientId',
        required: false,
        description: 'Se requiere el id del cliente',
    })
    @ApiOkResponse({
        description:
            'Lista de posteos que hizo el cliente, con todas las postulaciones y los profesionales que hicieron cada una de las postulaciones',
        schema: {
            example: [
                {
                    id: '6a5b437d-b201-41b0-a569-3b0610aa880e',
                    title: 'Necesito estantería',
                    description: 'Construcción de estantería a medida',
                    date: '2024-07-01',
                    priority: 'media',
                    photos: [
                        'https://example.com/job243_1.jpg',
                        'https://example.com/job243_2.jpg',
                    ],
                    status: 'completado',
                    review: {
                        rating: '5.00',
                        comment:
                            'Construcción de estantería perfecta, excelente calidad.',
                    },
                    location: 'Barranco',
                    categories: ['Carpintero'],
                    applications: [
                        {
                            status: 'rejected',
                            professional: {
                                id: 'f1ae6dc4-bb98-402a-a702-a99212c8e607',
                                fullname: 'María López',
                                profileImg:
                                    'https://i.pravatar.cc/150?u=a042581f4e29026704d',
                                rating: 4.6,
                                years_experience: 9,
                                availability: true,
                            },
                        },
                        {
                            status: 'rejected',
                            professional: {
                                id: 'cea75225-aea5-4483-bf50-2c08903c8025',
                                fullname: 'Carlos Pérez',
                                profileImg:
                                    'https://i.pravatar.cc/150?u=a042581f4e29026704d',
                                rating: 4.9,
                                years_experience: 8,
                                availability: true,
                            },
                        },
                    ],
                },
            ],
        },
    })
    @Get('clients/:clientId')
    async postedJobsByClient(
        @Param('clientId', ParseUUIDPipe) clientId: string,
    ) {
        const postedJobs =
            await this.postedJobService.postedJobsByClient(clientId);

        return postedJobs;
    }

    @Get(':id')
    async findJob(@Param('id', ParseUUIDPipe) id: string) {
        const postedJob = await this.postedJobService.findJob(id);

        return postedJob;
    }
}
