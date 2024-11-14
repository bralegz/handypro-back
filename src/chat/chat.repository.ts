import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from './chat.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ChatRepository {
    constructor(
        @InjectRepository(Chat)
        private readonly chatRepository: Repository<Chat>,
    ) {}

    async getChats(room: string): Promise<Chat[]> {
        try {
            const chats = await this.chatRepository
                .createQueryBuilder('chat')
                .where('chat.room = :room', { room })
                .orderBy('chat.timestamp', 'DESC')
                .take(50)
                .getMany();

            return chats;
        } catch (error) {
            console.error('Error al obtener los chats', error);
            throw new InternalServerErrorException(
                'Error al obtener los chats',
            );
        }
    }

    async saveChat(chat: Chat): Promise<Chat> {
        try {
            return await this.chatRepository.save(chat);
        } catch (error) {
            console.error('Error al guardar el chat', error);
            throw new InternalServerErrorException(
                'Error al guardar el chat',
            );
        }
    }
}
