import { Controller, Get, Query } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private readonly usersService: UserService) {}

    @Get()
    getProfessionals(
        @Query('professions') professions?: string,
        @Query('page') page?: number,
        @Query('limit') limit?: number,
    ) {
        return this.usersService.getProfessionals(professions, page, limit);
    }
}
