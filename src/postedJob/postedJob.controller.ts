import {
    Controller,
    Get,
    Body,
    Param,
    ParseUUIDPipe,
    Query,
} from '@nestjs/common';
import { PostedJobService } from './postedJob.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('posted-jobs')
@Controller('posted-jobs')
export class PostedJobController {
    constructor(private readonly postedJobService: PostedJobService) {}

    @Get('byCategory')
    findByCategory(@Query('category') category?: string) {
        return this.postedJobService.findByCategory(category);
    }

    @Get()
    findAll() {
        return this.postedJobService.findAll();
    }

    // @Get('professionals/:professionalId')
    // async acceptedJobsByProfessional(
    //     @Param('professionalId', ParseUUIDPipe) professionalId: string,
    // ) {
    //     const acceptedJobs =
    //         await this.postedJobService.acceptedJobsByProfessional(
    //             professionalId,
    //         );
    //     return acceptedJobs;
    // }

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
