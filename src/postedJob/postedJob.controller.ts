import {
    Controller,
    Get,
    Body,
    Param,
    ParseUUIDPipe,
    Query,
} from '@nestjs/common';
import { PostedJobService } from './postedJob.service';

@Controller('posted-jobs')
export class PostedJobController {
    constructor(private readonly postedJobService: PostedJobService) {}

    @Get()
    findAll() {
        return this.postedJobService.findAll();
    }

    @Get('professions')
    findByProfession(@Query('professions') professions?: string) {
        return this.postedJobService.findByProfession(professions);
    }

    @Get('professionals/:professionalId')
    async acceptedJobsByProfessional(
        @Param('professionalId', ParseUUIDPipe) professionalId: string,
    ) {
        const acceptedJobs =
            await this.postedJobService.acceptedJobsByProfessional(
                professionalId,
            );
        return acceptedJobs;
    }

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
