import {
    BadRequestException,
    Inject,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { UserRepository } from '../user/user.repository';
import { SignupUserDto } from '../user/dtos/signupUser.dto';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthJwtPayload } from './types/auth.jwtPayload';
import refreshJwtConfig from './config/refresh-jwt.config';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(
        private readonly userRepository: UserRepository,
        private jwtService: JwtService,
        @Inject(refreshJwtConfig.KEY) //this key represents the name specified in register as
        private refreshTokenConfig: ConfigType<typeof refreshJwtConfig>,
    ) {}

    async signUp(newUser: SignupUserDto) {
        try {
            //check if email already exists
            const userExists = await this.userRepository.findUserByEmail(
                newUser.email,
            );
            if (userExists) {
                throw new Error('Este usuario ya está registrado');
            }

            const userRegistered =
                await this.userRepository.createUser(newUser);

            return userRegistered;
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    //here you add the info you need to return to the client
    async validateUser(email: string, password: string) {
        const user = await this.userRepository.findUserByEmail(email);

        if (!user) throw new UnauthorizedException('Usuario no existe');

        //compare plain text password with password stored in database
        const isPasswordMatch = await compare(password, user.password);

        if (!isPasswordMatch)
            throw new UnauthorizedException('Credenciales inválidas');

        return {
            id: user.id,
            role: user.role,
            email: user.email,
            fullname: user.fullname,
        };
    }

    login(
        userId: string,
        userRole: string,
        userEmail: string,
        userName: string,
    ) {
        const payload: AuthJwtPayload = {
            userId,
            userRole,
            userName,
            userEmail,
        };

        const accessToken = this.jwtService.sign(payload);

        //This time we'll pass the refresh token configuration to sign it.
        const refreshToken = this.jwtService.sign(
            payload,
            this.refreshTokenConfig,
        );

        return {
            id: userId,
            token: accessToken,
            refreshToken: refreshToken,
        };
    }
}
