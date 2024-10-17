import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  signUp(@Body() newUser: any) {
    const userRegistered = this.authService.signUp(newUser);

    return userRegistered;
  }
}
