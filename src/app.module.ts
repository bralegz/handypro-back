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
import { ReviewsModule } from './review/review.module';
import { UploadPhotoModule } from './upload-photo/upload-photo.module';
import { ApplicationModule } from './application/application.module';
import { PaymentModule } from './payment/payment.module';
import { MailModule } from './mail/mail.module';
import mailConfig from './config/mail.config';


@Module({
    imports: [
        UserModule,
        AuthModule,
        PostedJobModule,
        ConfigModule.forRoot({ isGlobal: true, load: [typeOrmConfig, mailConfig] }),
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) =>
                configService.get('typeorm'),
        }),
        CategoryModule,
        LocationModule,
        ReviewsModule,
        UploadPhotoModule,
        ApplicationModule,
        MailModule,
        PaymentModule,
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
