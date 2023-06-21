import {
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway(3002, { path: '/', namespace: 'websocket' })
export class WSGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  private server: Server;

  private readonly timestamp = Date.now();

  afterInit(server: any) {
    this.server = server;
    throw new Error('Method not implemented.');
  }
  handleConnection(client: any, ...args: any[]) {
    throw new Error('Method not implemented.');
  }
  handleDisconnect(client: any) {
    throw new Error('Method not implemented.');
  }
}
