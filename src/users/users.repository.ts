import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersRepository {
  createUser(newUser: any) {
    return {
      message: 'User registered',
      user: newUser,
    };
  }
}
