import { Module, OnModuleInit } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import typeOrmConfig from './config/typeorm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostedJobModule } from './postedJob/postedJob.module';
import { CategoryModule } from './category/category.module';
import { PreloadService } from './preload.service'; // Asegúrate de que la ruta sea correcta
import { LocationModule } from './location/location.module';
import { UserRepository } from './user/user.repository';
import { ReviewsModule } from './review/review.module';

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
        CategoryModule,
        LocationModule,
        ReviewsModule
 
    ],
    controllers: [],
    providers: [PreloadService], 
})
export class AppModule implements OnModuleInit {
    constructor(private readonly preloadService: PreloadService) {}

    async onModuleInit() {
        await this.preloadService.preloadData();
    }
}
