import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository) {}

    async getProfessionals(professions: string, page: number, limit: number) {
        return await this.userRepository.getProfessionals(
            professions,
            page,
            limit,
        );
    }

    async getClients(page: number, limit: number) {
        return await this.userRepository.getClients(page, limit);
    }

    async getProfessionalById(id: string) {
        try {
            const user = await this.userRepository.getProfessionalById(id);

            if (!user) {
                throw new Error('El usuario no se encuentra registrado');
            }

            return user;
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }
}
