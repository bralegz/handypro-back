import { Injectable } from '@nestjs/common';
import { SignupUserDto } from './dtos/signupUser.dto';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(newUser: SignupUserDto) {
    const createdUser = this.userRepository.create(newUser);
    await this.userRepository.save(createdUser);

    return createdUser;
  }

  async findUserByEmail(email: string) {
    const user = this.userRepository.findOne({ where: { email } });

    return user;
  }
}
