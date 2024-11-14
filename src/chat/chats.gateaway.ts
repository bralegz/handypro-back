import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { Injectable, Scope } from '@nestjs/common';
import { ChatService } from './chat.service'; 
import { Chat } from './chat.entity';

@Injectable({ scope: Scope.DEFAULT })
@WebSocketGateway({
  cors: {
      origin: '*',
  },
})
export class ChatsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(private readonly chatService: ChatService) {}

  handleConnection(socket: Socket) {
      console.log('A user connected:', socket.id);
      const connectedSockets = this.server.sockets.sockets.size;
      console.log(`Total connected sockets: ${connectedSockets}`);
  }

  handleDisconnect(socket: Socket) {
      console.log(`User disconnected: ${socket.id}`);
      const connectedSockets = this.server.sockets.sockets.size;
      console.log(`Total connected sockets after disconnection: ${connectedSockets}`);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(socket: Socket, room: string) {
      socket.join(room);
      console.log(`User ${socket.id} joined room: ${room}`);
      const rooms = Object.keys(socket.rooms); 
      console.log(`User ${socket.id} is in rooms: ${rooms}`);
  }

  @SubscribeMessage('chat')
  async handleChat(
      socket: Socket,
      data: { username: string; room: string; message: string },
  ) {
      console.log('Chat received:', data);
      try {
          const chatData = new Chat();
          chatData.username = data.username;
          chatData.room = data.room;
          chatData.message = data.message;
          chatData.timestamp = new Date();
          await this.chatService.saveChat(chatData);
          this.server.to(data.room).emit('chat', chatData);
      } catch (err) {
          console.error('Error while saving the message:', err);
      }
  }
}
