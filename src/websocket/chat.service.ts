import { Injectable } from '@nestjs/common';
import { RoomService } from './room.service';
import { Server } from 'socket.io';
import { WebSocketServer } from '@nestjs/websockets';

@Injectable()
export class ChatService {
  constructor(private roomService: RoomService) {}
  @WebSocketServer() private server: Server;

  sendMessage(roomId: string, userId: string, message: string) {
    const roomMembers = this.roomService.getRoomMembers(roomId);
    if (roomMembers.includes(userId)) {
      this.server.emit('message', { userId, message });
    } else {
      // Gérer l'erreur - l'utilisateur n'appartient pas à la room
    }
  }
}
