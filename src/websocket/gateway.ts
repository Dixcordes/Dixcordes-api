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

  @SubscribeMessage('serverMessage')
  sendMessage(
    @MessageBody() data: { roomId: number; userId: string; message: string },
  ) {
    
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
