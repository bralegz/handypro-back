import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import typeOrmConfig from './config/typeorm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostedJobModule } from './postedJob/postedJob.module';
import { LocationModule } from './location/location.module';

@Module({
    imports: [
        UserModule,
        AuthModule,
        PostedJobModule,
        ConfigModule.forRoot({ isGlobal: true, load: [typeOrmConfig] }),
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) =>
                configService.get('typeorm'),
        }),
        LocationModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
