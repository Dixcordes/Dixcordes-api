import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';

@WebSocketGateway(3001, {
  cors: {
    origin: '*',
  },
})
export class MyGateway {
  @SubscribeMessage('message')
  onMessage(@MessageBody() body: any) {
    console.log(body);
  }
}
