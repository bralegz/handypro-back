import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupUserDto } from '../users/dtos/signupUser.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async signUp(@Body() newUser: SignupUserDto) {
    const userRegistered = await this.authService.signUp(newUser);

    return {
      mensaje: 'Usuario registrado exitosamente',
      usuario: userRegistered,
    };
  }
}
