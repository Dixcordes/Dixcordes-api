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
import { MessageInChannelDto } from './dto/message-channel.dto';
import { ServersService } from '../servers/servers.service';
import { ChannelsGatewayServices } from './channels-gateway.service';

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
    private serverService: ServersService,
    private channelsGatewayServices: ChannelsGatewayServices,
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
      client.to(channelName).emit('roomCreated', { room: channelName });
      client.emit('channel', {
        event: 'roomCreated',
        room: channelName,
      });
      return 'channel created';
    } catch (error) {
      console.log(error);
      throw new WsException('Error while creating the channel');
    }
  }

  @SubscribeMessage('joinChannel')
  async onJoinChannel(
    @MessageBody() channelName: string,
    @ConnectedSocket() socket: Socket,
  ) {
    try {
      const user = await this.userUtilsWs.FindUserFromWsHandshake(socket);
      if (!user) throw new Error('User not found');
      const channel = await this.channelsService.findOneByName(channelName);
      if (!channel) throw new Error('User not found');
      const server = await this.channelsService.findServerFromChannel(
        channelName,
      );
      if (!server)
        throw new WsException(`${channelName} is not part of a server`);
      socket.join(channelName);
      this.server.emit(channelName, user.firstName + ' join the channel.');
    } catch (error) {
      console.log(error);
      throw new WsException(error);
    }
  }

  @SubscribeMessage('messageToChannel')
  async onSendingMessageInChannel(
    @MessageBody() messageInChannelDto: MessageInChannelDto,
    @ConnectedSocket() socket: Socket,
  ) {
    try {
      const user = await this.userUtilsWs.FindUserFromWsHandshake(socket);
      if (!user) throw new Error('User not found');
      const server = await this.channelsService.findServerFromChannel(
        messageInChannelDto.channelName,
      );
      if (!server)
        throw new WsException(
          `${messageInChannelDto.channelName} is not part of a server`,
        );
      const isUserInServer = await this.serverService.getOneMember(
        server.id,
        user.id,
      );
      if (!isUserInServer)
        throw new WsException(
          'You are not allowed to send message in this channel.',
        );
      socket.join(messageInChannelDto.channelName);
      const author = (messageInChannelDto.author = user.firstName);
      socket
        .to(messageInChannelDto.channelName)
        .emit(
          messageInChannelDto.channelName,
          `${author}: ${messageInChannelDto.content}`,
        );
      this.channelsGatewayServices.saveMessage({
        author: user.firstName,
        content: messageInChannelDto.content,
        channelName: messageInChannelDto.channelName,
      });
    } catch (error) {
      console.log(error);
      throw new WsException(error);
    }
  }
}
