import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersRepository } from '../users/users.repository';
import { SignupUserDto } from '../users/dtos/signupUser.dto';

@Injectable()
export class AuthService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async signUp(newUser: SignupUserDto) {
    try {
      //check if email already exists
      const userExists = await this.usersRepository.findUserByEmail(
        newUser.email,
      );
      if (userExists) {
        throw new Error('Este usuario ya está registrado');
      }

      const userRegistered = await this.usersRepository.createUser(newUser);

      return userRegistered;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
