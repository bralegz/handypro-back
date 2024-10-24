import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('user')
@Controller('user')
export class UserController {
    constructor(private readonly usersService: UserService) {}

    @Get('professionals')
    async getProfessionals(
        @Query('professions') professions?: string,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 5,
    ) {
        return await this.usersService.getProfessionals(
            professions,
            Number(page),
            Number(limit),
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
}
