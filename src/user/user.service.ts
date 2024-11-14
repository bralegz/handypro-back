import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UpdateUserDto } from './dtos/updateUser.dto';
import { UserRole } from './enums/user-role.enum';

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
            if (role === UserRole.ADMIN) {
                throw new BadRequestException(
                    'No puedes cambiar tu rol a administrador',
                );
            }

            if (
                ![UserRole.CLIENT, UserRole.PROFESSIONAL].includes(
                    role as UserRole,
                )
            ) {
                throw new ForbiddenException(
                    "Solamente puedes cambiar tu rol a 'client' o a 'professional'",
                );
            }

            const user = await this.userRepository.changeRole(userId, role);

            if (!user) {
                throw new Error('Usuario no existe');
            }

            return user;
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    async updateProfile(userNewInfo: UpdateUserDto, userId: string) {
        try {
            const userUpdated = await this.userRepository.updateProfile(
                userNewInfo,
                userId,
            );

            return userUpdated;
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    async toggleUserActiveStatus(userId: string) {
        try {
            const user = await this.userRepository.toggleUserActiveStatus(userId);

            return user;
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    async getInactiveUsers() {
        try {
            const users = await this.userRepository.getInactiveUsers();

            if (!users || users.length === 0) {
                throw new Error('No se encontraron usuarios inactivos');
            }

            return users;
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    async getAdmins() {
        try {
            const users = await this.userRepository.getUsersByRole(UserRole.ADMIN);

            if (!users || users.length === 0) {
                throw new Error('No se encontraron usuarios administradores');
            }

            return users;
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    async deleteUser(userId: string) {
        try {
            const user = await this.userRepository.findUserById(userId);
            if (!user) {
                throw new NotFoundException('Usuario no encontrado');
            }
            const deleteResult = await this.userRepository.deleteUser(userId);
            return deleteResult;
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }
}
