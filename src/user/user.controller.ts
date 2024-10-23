import { Controller, Get, Query } from '@nestjs/common';
import { UserService } from './user.service';

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
        @Query('page') page?: number,
        @Query('limit') limit?: number,
    ) {
        return await this.usersService.getClients(Number(page), Number(limit));
    }
}
