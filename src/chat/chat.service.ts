import { Injectable } from '@nestjs/common';
import { Chat } from './chat.entity';
import { ChatRepository } from './chat.repository';

@Injectable()
export class ChatService {
    constructor(private readonly chatRepository: ChatRepository) {}

    async getChats(room: string): Promise<Chat[]> {
        return this.chatRepository.getChats(room);
    }

    async saveChat(chat: Chat): Promise<Chat> {
        return this.chatRepository.saveChat(chat);
    }
}
