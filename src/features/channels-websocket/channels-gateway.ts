import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/features/users/users.service';
import { ChannelsService } from 'src/features/channels/channel.service';
import { UnauthorizedException } from '@nestjs/common';
import { UserUtilsWs } from '../../utils/ws/user-utils-ws';

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
    private userUtilsWs: UserUtilsWs,
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

  @SubscribeMessage('createChannel')
  async onMessageInChannel(
    @MessageBody()
    channelName: string,
    @ConnectedSocket() client: Socket,
  ): Promise<string> {
    try {
      const channel = await this.channelsService.findOneByName(channelName);
      if (!channel) throw new WsException('Channel not found');
      client.join(channelName);
      this.server.to(channelName).emit('roomCreated', { room: channelName });
      this.server.emit('channel', {
        event: 'roomCreated',
        room: channelName,
      });
      return 'channel created';
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @SubscribeMessage('joinChannel')
  async onJoinChannel(
    @MessageBody() channelName: string,
    @ConnectedSocket() socket: Socket,
  ) {
    try {
      const findUser = await this.jwtService.verifyAsync(
        socket.handshake.headers.authorization,
      );
      if (!findUser) throw new Error('User not found');
      console.log(findUser);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
