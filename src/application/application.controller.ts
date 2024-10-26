import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApplicationService } from './application.service';

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
}
