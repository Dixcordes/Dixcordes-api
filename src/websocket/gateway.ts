import { UnauthorizedException, UseGuards } from '@nestjs/common';
import {
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Socket } from 'socket.io';
import { RoomService } from './room.service';
import { ChatService } from './chat.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@WebSocketGateway(3001, {
  namespace: '/chat',
  cors: {
    origin: '*',
  },
})
export class MyGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;
  constructor(
    private roomService: RoomService,
    private chatService: ChatService,
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async onGatewayConnection(socket: Socket) {
    try {
      const token = this.extractTokenFromHeader(
        socket.handshake.headers.authorization,
      );
      if (!token) {
        console.log('Token not found');
        return this.disconnect(socket);
      }

      const decodedToken = this.jwtService.verify(token);
      const user = await this.usersService.findOne(decodedToken.sub);
      if (!user) {
        console.log('User not found');
        return this.disconnect(socket);
      } else {
        console.log('Connected');
      }
    } catch {
      this.disconnect(socket);
    }
  }

  private extractTokenFromHeader(authorizationHeader: string): string | null {
    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authorizationHeader.split(' ')[1];
    return token;
  }

  async handleConnection(socket: Socket) {
    try {
      const decodedToken = await this.jwtService.verifyAsync(
        socket.handshake.headers.authorization,
      );
      const user = await this.usersService.findOne(decodedToken.sub);
      if (!user) {
        console.log('User not found');
        return this.disconnect(socket);
      } else {
        console.log('Connected');
      }
    } catch {
      this.disconnect(socket);
    }
  }

  private disconnect(socket: Socket) {
    socket.emit('Error', new UnauthorizedException());
    socket.disconnect();
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

  @UseGuards(AuthGuard)
  @SubscribeMessage('message')
  onMessage(@MessageBody() body: any) {
    console.log(body);
    this.server.emit('message', {
      message: 'New message',
      content: body,
    });
  }
}
