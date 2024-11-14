import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ChatRepository } from './chat.repository';
import { Chat } from './chat.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatsGateway } from './chats.gateaway';

@Module({
  imports: [
    TypeOrmModule.forFeature([Chat]), 
  ],
  controllers: [ChatController],
  providers: [ChatService, ChatRepository, ChatsGateway],
})
export class ChatModule {}
