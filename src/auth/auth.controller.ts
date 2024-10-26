import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Request,
    Res,
    UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupUserDto } from '../user/dtos/signupUser.dto';
import { ApiBearerAuth, ApiBody, ApiTags, ApiResponse } from '@nestjs/swagger';
import { LocalAuthGuard } from './guards/local-auth/local-auth.guard';
import { LoginDto } from '../user/dtos/loginUser.dto';
import { RefreshAuthGuard } from './guards/refresh-auth/refresh-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth/google-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('signup')
    @ApiBody({
        description: 'Registro de un nuevo usuario',
        type: SignupUserDto,
        examples: {
            ejemplo1: {
                summary: 'Usuario válido',
                value: {
                    email: 'john.doe@example.com',
                    fullname: 'John Doe',
                    password: 'Str0ngP@ssw0rd!',
                    confirmationPassword: 'Str0ngP@ssw0rd!',
                },
            },
            ejemplo2: {
                summary: 'Otro usuario válido',
                value: {
                    email: 'jane.doe@example.com',
                    fullname: 'Jane Doe',
                    password: 'An0th3rStr0ngP@ss',
                    confirmationPassword: 'An0th3rStr0ngP@ss',
                },
            },
        },
    })
    @ApiResponse({ status: 201, description: 'Usuario registrado exitosamente.' })
    @ApiResponse({ status: 400, description: 'Solicitud inválida.' })
    async signUp(@Body() newUser: SignupUserDto) {
        const userRegistered = await this.authService.signUp(newUser);

        return {
            mensaje: 'Usuario registrado exitosamente',
            usuario: userRegistered,
        };
    }

    @HttpCode(HttpStatus.OK)
    @UseGuards(LocalAuthGuard)
    @Post('login')
    @ApiBody({ type: LoginDto })
    login(@Request() req) {
        return this.authService.login(
            req.user.id,
            req.user.role,
            req.user.email,
            req.user.fullname,
        );
    }

    @ApiBearerAuth()
    @UseGuards(RefreshAuthGuard)
    @HttpCode(HttpStatus.OK)
    @Post('refresh')
    @ApiResponse({ status: 200, description: 'Token refrescado exitosamente.' })
    @ApiResponse({ status: 401, description: 'Token de refresco inválido o expirado.' })
    @ApiResponse({ status: 403, description: 'No autorizado.' })
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
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    @Post('signout')
    signOut(@Request() req) {
        this.authService.signOut(req.user.id);
        return 'Logged out';
    }

    @UseGuards(GoogleAuthGuard)
    @Get('google/login')
    googleLogin() {}

    @UseGuards(GoogleAuthGuard)
    @Get('google/callback')
    async googleCallback(@Request() req, @Res() res) {
        const response = await this.authService.login(
            req.user.id,
            req.user.role,
            req.user.email,
            req.user.fullname,
        );

        res.redirect(`http://localhost:3000/api?token=${response.token}`);
    }
}
