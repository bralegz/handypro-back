import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
    getProfessionals(professions: string, page: number, limit: number): any {
        throw new Error('Method not implemented.');
    }
}
