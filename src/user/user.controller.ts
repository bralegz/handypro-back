import {
    Controller,
    Get,
    Param,
    ParseUUIDPipe,
    Post,
    Query,
    Req,
    UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiTags, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';

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
    @Get('professionals')
    async getProfessionals(
        @Query('categories') categories?: string,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 5,
        @Query('name') name?: string,
    ) {
        return await this.usersService.getProfessionals(
            categories,
            Number(page),
            Number(limit),
            name,
        );
    }

    @Get('clients')
    async getClients(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 5,
    ) {
        return await this.usersService.getClients(Number(page), Number(limit));
    }

    @Get('professional/:id')
    async getProfessionalById(@Param('id', ParseUUIDPipe) id: string) {
        const user = await this.usersService.getProfessionalById(id);

        return user;
    }

    @Get('client/:id')
    async getClientById(@Param('id', ParseUUIDPipe) id: string) {
        const user = await this.usersService.getClientById(id);

        return user;
    }

    /* When this endpoint is called the JwtAuthGuard and it activates the JwtStrategy and it looks for the jwt token inside the header of the request and validates it. If its valid, then it will be decoded and the payload will pass through the validate function in the jwt strategy and then appended to Request.user*/
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Get('profile')
    async getProfile(@Req() req) {
        return await this.usersService.getProfile(req.user.id);
    }

    @Post('changeRole/:id')
    async changerole(
        @Param('id', ParseUUIDPipe) id: string,
        @Query('role') role: string,
    ) {
        return this.usersService.changeRole(id, role);
    }
}
