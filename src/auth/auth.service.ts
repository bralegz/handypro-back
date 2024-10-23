import {
    BadRequestException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { UserRepository } from '../user/user.repository';
import { SignupUserDto } from '../user/dtos/signupUser.dto';
import { compare } from 'bcrypt';

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

    async login(email: string, password: string) {
        const user = await this.userRepository.findUserByEmail(email);

        if (!user) throw new UnauthorizedException('Usuario no existe');

        const isPasswordMatch = await compare(password, user.password);

        if (!isPasswordMatch)
            throw new UnauthorizedException('Credenciales inválidas');

        return { id: user.id };
    }
}
