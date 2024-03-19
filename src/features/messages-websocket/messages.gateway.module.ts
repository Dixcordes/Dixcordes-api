import { Module } from '@nestjs/common';
import { MessagesGateway } from './messages.gateway';
import { UsersService } from 'src/features/users/users.service';
import { UsersModule } from 'src/features/users/users.module';
import { ServersModule } from 'src/features/servers/servers.module';
import { ServersService } from 'src/features/servers/servers.service';

@Module({
  imports: [UsersModule, ServersModule],
  providers: [MessagesGateway, UsersService, ServersService],
})
export class MessagesGatewayModule {}
