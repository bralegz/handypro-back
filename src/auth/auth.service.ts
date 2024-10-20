import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRepository } from '../user/user.repository';
import { SignupUserDto } from '../user/dtos/signupUser.dto';

@Injectable()
export class AuthService {
    constructor(private readonly userRepository: UserRepository) {}

    async signUp(newUser: SignupUserDto) {
        try {
            //check if email already exists
            const userExists = await this.userRepository.findUserByEmail(
                newUser.email,
            );
            if (userExists) {
                throw new Error('Este usuario ya está registrado');
            }

            const userRegistered =
                await this.userRepository.createUser(newUser);

            return userRegistered;
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }
}
