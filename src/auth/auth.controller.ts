import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupUserDto } from '../user/dtos/signupUser.dto';
import { ApiTags } from '@nestjs/swagger';
import { LoginUserDto } from '../user/dtos/loginUser.dto';

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

    @Post('login')
    async login(@Body() user: LoginUserDto) {
        return await this.authService.login(user.email, user.password);
    }
}
