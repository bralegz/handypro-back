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
import * as argon2 from 'argon2';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';

@Injectable()
export class AuthService {
    constructor(
        private readonly userRepository: UserRepository,
        private jwtService: JwtService,
        @Inject(refreshJwtConfig.KEY) //this key represents the name specified in register as of refresh token
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
    //The returned object of this function will be appended to Req.User through the local strategy.
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

    async login(
        userId: string,
        userRole: string,
        userEmail: string,
        userName: string,
    ) {
        // const payload: AuthJwtPayload = {
        //     userId,
        //     userRole,
        //     userName,
        //     userEmail,
        // };

        // const accessToken = this.jwtService.sign(payload);

        // //This time we'll pass the refresh token configuration to sign it.
        // const refreshToken = this.jwtService.sign(
        //     payload,
        //     this.refreshTokenConfig,
        // );

        const { accessToken, refreshToken } = await this.generateTokens(
            userId,
            userRole,
            userEmail,
            userName,
        );

        const hashedRefreshToken = await argon2.hash(refreshToken);

        await this.userRepository.updateHashedRefreshToken(
            userId,
            hashedRefreshToken,
        );

        return {
            id: userId,
            token: accessToken,
            refreshToken: refreshToken,
        };
    }

    //This function will generate access and refresh tokens
    async generateTokens(
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

        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload),
            this.jwtService.signAsync(payload, this.refreshTokenConfig),
        ]);

        return {
            accessToken,
            refreshToken,
        };
    }

    //just like the login function but using a different strategy (refresh token strategy)
    async refreshToken(
        userId: string,
        userRole: string,
        userEmail: string,
        userName: string,
    ) {
        const { accessToken, refreshToken } = await this.generateTokens(
            userId,
            userRole,
            userEmail,
            userName,
        );

        const hashedRefreshToken = await argon2.hash(refreshToken);

        await this.userRepository.updateHashedRefreshToken(
            userId,
            hashedRefreshToken,
        );

        return {
            id: userId,
            token: accessToken,
            refreshToken,
        };
    }

    async validateRefreshToken(userId: string, refreshToken: string) {
        //this refresh token is the one coming from the headers. its not hashed
        const user = await this.userRepository.findUserById(userId);

        if (!user || !user.hashedRefreshToken) {
            throw new UnauthorizedException('Refresh token inválido');
        }

        const hashedRefreshToken = user.hashedRefreshToken;
        const refreshTokenMatches = await argon2.verify(
            hashedRefreshToken,
            refreshToken,
        );

        if (refreshTokenMatches) {
            throw new UnauthorizedException('Refresh token inválido');
        }

        return {
            id: user.id,
            role: user.role,
            email: user.email,
            fullname: user.fullname,
        };
    }
}
