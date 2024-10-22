import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository) {}
    async getProfessionals(professions: string, page: number, limit: number): Promise<any> {
      return await this.userRepository.getProfessionals(professions, page, limit);
    }
}

