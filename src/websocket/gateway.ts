import { OnModuleInit } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { RoomService } from './room.service';
import { stringify } from 'querystring';

@WebSocketGateway(3001, {
  cors: {
    origin: '*',
  },
})
export class MyGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;
  constructor(private roomService: RoomService) {}

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
  joinRoom(data) {
    this.roomService.joinRoom(data.roomName, data.userId);
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
