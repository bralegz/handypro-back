import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { User } from './user.entity';

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
}
