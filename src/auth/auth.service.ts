import { Injectable } from '@nestjs/common';
import { UsersRepository } from 'src/users/users.repository';

@Injectable()
export class AuthService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async signUp(newUser: any) {
    const userRegistered = this.usersRepository.createUser(newUser);

    return userRegistered;
  }
}
