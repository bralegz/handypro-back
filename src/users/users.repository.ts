import { Injectable } from '@nestjs/common';
import { SignupUserDto } from './dtos/signupUser.dto';
import { Repository } from 'typeorm';
import { Users } from './users.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}

  async createUser(newUser: SignupUserDto) {
    const createdUser = this.usersRepository.create(newUser);
    await this.usersRepository.save(createdUser);

    return createdUser;
  }

  async findUserByEmail(email: string) {
    const user = this.usersRepository.findOne({ where: { email } });

    return user;
  }
}
