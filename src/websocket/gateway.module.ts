import { Module } from '@nestjs/common';
import { MyGateway } from './gateway';
import { RoomService } from './room.service';
import { ChatService } from './chat.service';
import { UsersService } from 'src/users/users.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [UsersModule],
  providers: [MyGateway, RoomService, ChatService, UsersService],
})
export class GatewayModule {}
