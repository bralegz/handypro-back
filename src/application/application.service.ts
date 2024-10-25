import { Injectable } from '@nestjs/common';
import { ApplicationRepository } from './application.repository';

@Injectable()
export class ApplicationService {
    constructor(
        private readonly applicationsRepository: ApplicationRepository,
    ) {}

    async applicationsByProfessional(professionalId: string) {
        return await this.applicationsRepository.applicationsByProfessional(
            professionalId,
        );
    }
}
