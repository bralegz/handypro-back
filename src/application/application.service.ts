import { BadRequestException, Injectable } from '@nestjs/common';
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

    async createApplication(postedJobId: string, professionalId: string) {
        try {
            const createdApplication =
                await this.applicationsRepository.createApplication(
                    postedJobId,
                    professionalId,
                );

            return createdApplication;
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    async acceptApplication(applicationId: string) {
        try {
            return await this.applicationsRepository.acceptApplication(
                applicationId,
            );
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }
}
