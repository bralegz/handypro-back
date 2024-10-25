import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Request,
    UnauthorizedException,
    UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupUserDto } from '../user/dtos/signupUser.dto';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from './guards/local-auth/local-auth.guard';
import { LoginDto } from '../user/dtos/loginUser.dto';
import { RefreshAuthGuard } from './guards/refresh-auth/refresh-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard';

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
    login(@Request() req) {
        //Upon a successful login with local strategy we need to generate a jwt token and return it back with the user id.

        //We send the information to the login function so the token can be signed and returned
        return this.authService.login(
            req.user.id,
            req.user.role,
            req.user.email,
            req.user.fullname,
        );
    }

    @ApiBearerAuth()
    @UseGuards(RefreshAuthGuard) //activates the refresh token strategy
    @Post('refresh')
    refreshToken(@Request() req) {
        return this.authService.refreshToken(
            req.user.id,
            req.user.role,
            req.user.email,
            req.user.fullname,
        );
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard) //looks for access token, decode that token, extract the user id from that decoded access token and appends the user id to the request object.
    @HttpCode(HttpStatus.OK)
    @Post('signout')
    signOut(@Request() req) {
        this.authService.signOut(req.user.id);

        return 'Logged out';
    }

    @Get('google/login')
    googleLogin() {}
}
