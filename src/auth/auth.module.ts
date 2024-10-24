import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserRepository } from '../user/user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from './config/jwt.config';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        JwtModule.registerAsync(jwtConfig.asProvider()),
    ],
    controllers: [AuthController],
    providers: [AuthService, UserRepository, LocalStrategy],
})
export class AuthModule {}
