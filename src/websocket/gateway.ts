import { OnModuleInit } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { RoomService } from './room.service';
import { ChatService } from './chat.service';

@WebSocketGateway(3001, {
  cors: {
    origin: '*',
  },
})
export class MyGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;
  constructor(
    private roomService: RoomService,
    private chatService: ChatService,
  ) {}

  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log(socket.id);
      console.log('Connected');
    });
  }

  @SubscribeMessage('createRoom')
  createRoom(@MessageBody() body: string) {
    this.roomService.createRoom(body);
  }

  @SubscribeMessage('joinRoom')
  joinRoom(@MessageBody() data: { roomName: string; userId: string }) {
    this.roomService.joinRoom(data.roomName, data.userId);
  }

  @SubscribeMessage('leaveRoom')
  leaveRoom(@MessageBody() data: { roomName: string; userId: string }) {
    this.roomService.leaveRoom(data.roomName, data.userId);
  }

  @SubscribeMessage('getRoomMembers')
  getRoomMembers(@MessageBody() data: { roomName: string }) {
    this.roomService.getRoomMembers(data.roomName);
  }

  // @SubscribeMessage('roomMessage')
  // sendMessage(
  //   @MessageBody() data: { roomName: string; userId: string; message: string },
  // ) {
  //   this.chatService.sendMessage(data.roomName, data.userId, data.message);
  // }

  @SubscribeMessage('roomMessage')
  sendMessage(
    @MessageBody() data: { roomName: string; userId: string; message: string },
  ) {
    const roomMembers = this.roomService.getRoomMembers(data.roomName);
    if (roomMembers.includes(data.userId)) {
      //console.log('message', { userId, message });
      this.server.emit('roomMessage' + data.roomName, {
        userId: data.userId,
        message: data.message,
      });
    } else {
      console.log('User not in room');
    }
  }

  @SubscribeMessage('message')
  onMessage(@MessageBody() body: any) {
    console.log(body);
    this.server.emit('message', {
      message: 'New message',
      content: body,
    });
  }
}
