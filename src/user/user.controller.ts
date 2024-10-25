import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('user')
@Controller('user')
export class UserController {
    constructor(private readonly usersService: UserService) {}

    @ApiQuery({
        name: 'page',
        required: false,
        description: 'Tiene valor por defecto = 1',
        example: '1',
    })
    @ApiQuery({
        name: 'limit',
        required: false,
        description: 'Tiene valor por defecto = 5',
        example: '5',
    })
    @ApiQuery({
        name: 'categories',
        required: false,
        description:
            'Si se quiere buscar por mas de una categoria debe separarlo por cómas, es indiferente a las MAYUSC. ES SENSIBLE A LOS ACENTOS',
        example: 'Mecanico, Jardinero',
    })
    @ApiQuery({
        name: 'name',
        required: false,
        description:
            'Solo se puede buscar por un nombre a la vez, es indiferente a las MAYUSC',
        example: 'JUAN',
    })
    @ApiQuery({
        name: 'rating',
        required: false,
        description:
            'Tiene valor por default = 1, lo que significa que ordernara por defecto de MAY a MEN. Si desea ordenar de MEN a MAY se debera cambiar su valor a 0 (cero)',
        example: '1',
    })
    @Get('professionals')
    async getProfessionals(
        @Query('categories') categories?: string,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 5,
        @Query('name') name?: string,
        @Query('rating') rating: number = 1,
    ) {
        return await this.usersService.getProfessionals(
            categories,
            Number(page),
            Number(limit),
            name,
            Number(rating),
        );
    }

    @Get('clients')
    async getClients(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 5,
    ) {
        return await this.usersService.getClients(Number(page), Number(limit));
    }

    @Get(':id')
    async getProfessionalById(@Param('id', ParseUUIDPipe) id: string) {
        const user = await this.usersService.getProfessionalById(id);

        return user;
    }
}
