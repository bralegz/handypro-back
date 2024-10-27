import { Controller, Get, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { ApiTags } from '@nestjs/swagger';

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
    //The professional category should match the postedJob category
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
