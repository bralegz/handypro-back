import {
    Controller,
    Get,
    Body,
    Param,
    ParseUUIDPipe,
    Query,
    Post,
} from '@nestjs/common';
import { PostedJobService } from './postedJob.service';
import { ApiTags } from '@nestjs/swagger';
import { CreatePostedJobDto } from './dto/createPostedJob.dto';

@ApiTags('posted-jobs')
@Controller('posted-jobs')
export class PostedJobController {
    constructor(private readonly postedJobService: PostedJobService) {}

    @Get()
    findAll() {
        return this.postedJobService.findAll();
    }

    @Get('byCategory')
    findByCategory(@Query('category') category?: string) {
        return this.postedJobService.findByCategory(category);
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

    @Post('post-job/:clientId')
    async createPostedJob(
        @Param('clientId', ParseUUIDPipe) clientId: string,
        @Body() newPostedJob: CreatePostedJobDto,
    ) {
        const { title, description, location, priority, category, photo } =
            newPostedJob;

        const postedJob = await this.postedJobService.createPostedJob(
            clientId,
            title,
            description,
            location,
            priority,
            category,
            photo,
        );

        return postedJob;
    }
}
