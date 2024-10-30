import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Location } from '../location/location.entity';
import { Category } from '../category/category.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User, Location, Category])],
    controllers: [UserController],
    providers: [UserService, UserRepository],
    exports: [UserRepository, TypeOrmModule],
})
export class UserModule {}
