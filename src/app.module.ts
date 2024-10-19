import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import typeOrmConfig from './config/typeorm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsModule } from './postedJobs/postedJobs.module';
import { LocationsModule } from './locations/locations.module';

@Module({
    imports: [
        UsersModule,
        AuthModule,
        PostsModule,
        ConfigModule.forRoot({ isGlobal: true, load: [typeOrmConfig] }),
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) =>
                configService.get('typeorm'),
        }),
        LocationsModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
