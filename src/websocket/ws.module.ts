import { Module, OnModuleInit } from '@nestjs/common';
import { WSGateway } from './ws.gateway';

@Module({
  providers: [WSGateway],
})
export class WSModule implements OnModuleInit {
  constructor(private readonly wsgateway: WSGateway) {}

  onModuleInit() {
    this.wsgateway.send('Hello World!');
  }
}
