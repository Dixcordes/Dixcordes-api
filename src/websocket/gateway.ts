import { UnauthorizedException } from '@nestjs/common';
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Socket } from 'socket.io';
import { RoomService } from './room.service';
import { ChatService } from './chat.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@WebSocketGateway(3001, {
  namespace: '/chat',
  cors: {
    origin: '*',
  },
})
export class MyGateway
  implements OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;
  constructor(
    private roomService: RoomService,
    private chatService: ChatService,
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  afterInit(server: Server) {
    console.log('Init the Gateway');
    server.use((socket, next) => {
      if (socket.handshake.headers.authorization) {
        next();
      } else {
        next(new UnauthorizedException());
      }
    });
  }

  async handleConnection(socket: Socket) {
    try {
      const decodedToken = await this.jwtService.verifyAsync(
        socket.handshake.headers.authorization,
      );
      const user = await this.usersService.findOne(decodedToken.sub);
      if (!user) {
        console.log('User not found');
        socket.disconnect();
      } else {
        console.log('Connected');
      }
    } catch {
      console.log(new UnauthorizedException());
      socket.disconnect();
    }
  }

  handleDisconnect(socket: Socket) {
    socket.disconnect();
    console.log('Disconnected');
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
