import { Injectable } from '@nestjs/common';
import { RoomService } from './room.service';
import { Server } from 'socket.io';
import {
  WebSocketServer,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';

@Injectable()
export class ChatService {
  @WebSocketServer() private server: Server;
  constructor(private roomService: RoomService) {}

  // sendMessage(roomName: string, userId: string, message: string) {
  //   const roomMembers = this.roomService.getRoomMembers(roomName);
  //   console.log(roomMembers);
  //   if (roomMembers.includes(userId)) {
  //     //console.log('message', { userId, message });
  //     this.server.emit('message', { userId, message });
  //   } else {
  //     console.log('User not in room');
  //   }
  // }
}
