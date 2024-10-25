import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserRepository } from '../user/user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from './config/jwt.config';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import refreshJwtConfig from './config/refresh-jwt.config';
import { RefreshJwtStrategy } from './strategies/refresh.strategy';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        JwtModule.registerAsync(jwtConfig.asProvider()),
        ConfigModule.forFeature(jwtConfig), // access the jwt config on the services of this module
        ConfigModule.forFeature(refreshJwtConfig),
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        UserRepository,
        LocalStrategy,
        JwtStrategy,
        RefreshJwtStrategy,
    ],
})
export class AuthModule {}
