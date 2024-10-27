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
import { ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
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
    @ApiResponse({
        status: 201,
        description: 'Trabajo posteado exitosamente',
        example: {
            title: 'La bañera se rompió',
            description: 'No me he bañado en 20 dias',
            date: '2024-10-27',
            priority: 'alta',
            photos: ['https://www.google.com/img/1221212'],
            client: {
                id: '41f36c2f-f8f3-42bd-895b-5f946fb0eb33',
                email: 'sergio.camacho@example.com',
                fullname: 'Sergio Camacho',
                profileImg: null,
            },
            location: 'La Molina',
            categories: 'Plomero',
            id: '9fa1cbba-320f-4ec2-8097-52a55821838b',
            status: 'pendiente',
        },
    })
    @ApiParam({
        description: 'UUID del cliente que está posteando el trabajo',
        name: 'clientId',
    })
    @ApiBody({
        description:
            'Datos del trabajo a postear. El location y el category tienen que ser escritos exactamente como están en la base de datos o devolverá un error.',
        type: CreatePostedJobDto,
    })
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
