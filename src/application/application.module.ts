import { Module } from '@nestjs/common';
import { ApplicationController } from './application.controller';
import { ApplicationService } from './application.service';
import { Application } from './application.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Application])],

  controllers: [ApplicationController],
  providers: [ApplicationService],
  exports: [TypeOrmModule],
})
export class ApplicationModule {}
