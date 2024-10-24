import {
    Controller,
    Get,
    Param,
    ParseUUIDPipe,
    Query,
    Req,
    UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';

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

    /* When this endpoint is called the JwtAuthGuard and it activates the JwtStrategy and it looks for the jwt token inside the header of the request and validates it. If its valid, then it will be decoded and the payload will pass through the validate function in the jwt strategy and then appended to Request.user*/
    @UseGuards(JwtAuthGuard)
    @Get('profile')
    async getProfile(@Req() req) {
        return await this.usersService.getProfile(req.user.id);
    }
}
