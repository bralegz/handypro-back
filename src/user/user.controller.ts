import { Controller, Get, Query } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private readonly usersService: UserService) {}

    @Get('professionals')
    async getProfessionals(
        @Query('professions') professions?: string,
        @Query('page') page?: number,
        @Query('limit') limit?: number,
    ) {
        return await this.usersService.getProfessionals(
            professions,
            page,
            limit,
        );
    }

    @Get('clients')
    async getClients(
        @Query('clients') clients?: string,
        @Query('page') page?: number,
        @Query('limit') limit?: number,
    ) {
        return await this.usersService.getClients(clients, page, limit);
    }
}
