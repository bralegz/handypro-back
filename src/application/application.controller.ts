import { Controller, Get, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('application')
@Controller('application')
export class ApplicationController {
    constructor(private readonly applicationService: ApplicationService) {}

    @Get('professionals/:professionalId')
    async applicationsByProfessional(
        @Param('professionalId', ParseUUIDPipe) professionalId: string,
    ) {
        const applicationJobs =
            await this.applicationService.applicationsByProfessional(
                professionalId,
            );
        return applicationJobs;
    }

    //This route should be role protected and the professional id should be extracted from req.user
    @ApiParam({
        name: 'postedJobId',
        type: 'string',
        description: 'UUID del trabajo posteado',
    })
    @ApiParam({
        name: 'professionalId',
        type: 'string',
        description: 'UUID del profesional que va a aplicar',
    })
    @ApiResponse({
        status: 201,
        description: 'La aplicación fue creada exitosamente',
        schema: {
            example: {
                professional: {
                    id: 'f2562866-c740-461f-ba9b-025a870c5d47',
                    fullname: 'Javier Mendoza',
                },
                postedJob: {
                    id: 'd388b2d2-a045-492a-9c04-58671f5c18df',
                    title: 'La bañera se rompió',
                },
                id: '9ae693a7-26e2-4597-8d89-60b49b3d3052',
                status: 'pendiente',
            },
        },
    })
    @ApiResponse({
        status: 400,
        description:
            'El usuario debe existir, el trabajo posteado debe existir, debe estar pendiente, debe ser un trabajo al que el profesional no haya postulado antes, la categoria del trabajo y la categoria del profesional deben coincidir',
    })
    @Post('apply/:postedJobId/:professionalId')
    async createApplication(
        @Param('postedJobId', ParseUUIDPipe) postedJobId: string,
        @Param('professionalId', ParseUUIDPipe) professionalId: string,
    ) {
        const application = await this.applicationService.createApplication(
            postedJobId,
            professionalId,
        );
        return application;
    }
}
