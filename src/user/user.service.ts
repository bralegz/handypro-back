import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository) {}

    async getProfessionals(
        categories: string,
        page: number,
        limit: number,
        name: string,
    ) {
        return await this.userRepository.getProfessionals(
            categories,
            page,
            limit,
            name,
        );
    }

    async getClients(page: number, limit: number) {
        return await this.userRepository.getClients(page, limit);
    }

    async getProfessionalById(id: string) {
        return await this.userRepository.getProfessionalById(id);
    }

    async getClientById(id: string) {
        try {
            const user = await this.userRepository.getClientById(id);

            if (!user) {
                throw new Error('El usuario no se encuentra registrado');
            }

            return user;
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    async getProfile(userId: string) {
        try {
            const user = await this.userRepository.getProfile(userId);
            if (!user) throw new Error('Usuario no encontrado');

            return user;
        } catch (error) {
            throw new NotFoundException(error.message);
        }
    }

    async changeRole(userId: string, role: string) {
        try {
            const user = await this.userRepository.changeRole(userId, role);

            if (!user) {
                throw new Error('Usuario no existe');
            }

            return user;
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }
}
