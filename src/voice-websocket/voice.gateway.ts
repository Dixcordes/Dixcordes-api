import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayInit,
  OnGatewayDisconnect,
  WebSocketServer,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
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

  users: { [key: string]: string } = {};

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

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    const roomId = this.users[client.id];
    if (roomId) {
      delete this.users[client.id];
      client.leave(roomId);
    }
  }

  @SubscribeMessage('join')
  handleJoin(client: Socket, roomId: string): void {
    this.users[client.id] = roomId;
    client.join(roomId);
  }

  @SubscribeMessage('leave')
  handleLeave(client: Socket, roomId: string): void {
    delete this.users[client.id];
    client.leave(roomId);
  }
}
