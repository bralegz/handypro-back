import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    Request,
    UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupUserDto } from '../user/dtos/signupUser.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from './guards/local-auth/local-auth.guard';
import { LoginDto } from '../user/dtos/loginUser.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('signup')
    async signUp(@Body() newUser: SignupUserDto) {
        const userRegistered = await this.authService.signUp(newUser);

        return {
            mensaje: 'Usuario registrado exitosamente',
            usuario: userRegistered,
        };
    }

    @HttpCode(HttpStatus.OK) //set status code 200
    @UseGuards(LocalAuthGuard)
    @Post('login')
    @ApiBody({ type: LoginDto })
    async login(@Request() req) {
        //Upon a successful login with local strategy we need to generate a jwt token and return it back with the user id.

        //We send the information to the login function so the token can be signed and returned
        return this.authService.login(
            req.user.id,
            req.user.role,
            req.user.email,
            req.user.fullname,
        );
    }
}
