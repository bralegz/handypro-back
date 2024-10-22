import { Controller, Get, Body, Param, ParseUUIDPipe } from '@nestjs/common';
import { PostedJobService } from './postedJob.service';

@Controller('posted-jobs')
export class PostedJobController {
    constructor(private readonly postedJobService: PostedJobService) {}

    @Get(':id')
    async findJob(@Param('id', ParseUUIDPipe) id: string) {
        const postedJob = await this.postedJobService.findJob(id);

        return postedJob;
    }

    @Get()
    findAll() {
        return this.postedJobService.findAll();
    }

    @Get('profession')
    findByProfession(@Body('profession') profession: string) {
        return this.postedJobService.findByProfession(profession);
    }
}
