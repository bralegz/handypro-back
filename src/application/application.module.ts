import { Module } from '@nestjs/common';
import { ApplicationController } from './application.controller';
import { ApplicationService } from './application.service';
import { Application } from './application.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationRepository } from './application.repository';
import { User } from 'src/user/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Application, User])],
    controllers: [ApplicationController],
    providers: [ApplicationService, ApplicationRepository],
    exports: [TypeOrmModule],
})
export class ApplicationModule {}
