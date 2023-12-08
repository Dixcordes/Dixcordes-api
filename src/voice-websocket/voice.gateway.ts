import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayInit,
  OnGatewayDisconnect,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Socket } from 'socket.io';
import { ServersService } from 'src/servers/servers.service';
import { UsersService } from 'src/users/users.service';

@WebSocketGateway(3002, {
  namespace: '/voice',
  cors: {
    origin: '*',
  },
})
export class VoiceGateway
  implements OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;
  socket: Socket;
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private serverService: ServersService,
  ) {}

  afterInit(server: Server) {
    console.log('Voice gateway initialized.');
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

  @SubscribeMessage('join')
  async onJoin(@MessageBody() data: { serverId: number }) {
    const server = await this.serverService.findOne(data.serverId);
    if (!server) {
      return;
    }
    server.users.forEach((user) => {
      server.emit('userJoined', { userId: user.id });
    });
    socket.join(server.id.toString());
    socket.emit('joined', { serverId: server.id });
  }
}
