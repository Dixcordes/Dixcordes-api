import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { ChannelsService } from '../channels/channel.service';
import { UnauthorizedException } from '@nestjs/common';

@WebSocketGateway({
  namespace: 'channel',
  cors: {
    origin: '*',
  },
})
export class ChannelsGateway
  implements OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;
  socket: Socket;
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private channelsService: ChannelsService,
  ) {}

  afterInit(server: Server) {
    console.log('[WebSocket] Channels gateway initialized.');
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
        console.log('Connected. socket: ', socket.id);
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
}
