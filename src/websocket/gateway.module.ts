import { Module } from '@nestjs/common';
import { MyGateway } from './gateway';
import { RoomService } from './room.service';
import { ChatService } from './chat.service';

@Module({
  providers: [MyGateway, RoomService, ChatService],
})
export class GatewayModule {}
