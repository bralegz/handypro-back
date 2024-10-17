import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupUserDto } from '../users/dtos/signupUser.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  signUp(@Body() newUser: SignupUserDto) {
    const userRegistered = this.authService.signUp(newUser);

    return userRegistered;
  }
}
