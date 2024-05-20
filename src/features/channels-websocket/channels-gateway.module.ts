import { Module } from '@nestjs/common';
import { ChannelsGateway } from './channels-gateway';
import { UsersService } from 'src/features/users/users.service';
import { UsersModule } from 'src/features/users/users.module';
import { ServersModule } from 'src/features/servers/servers.module';
import { ServersService } from 'src/features/servers/servers.service';
import { ChannelsModule } from '../channels/channel.module';
import { ChannelsService } from '../channels/channel.service';

@Module({
  imports: [UsersModule, ServersModule, ChannelsModule],
  providers: [ChannelsGateway, UsersService, ServersService, ChannelsService],
})
export class ChannelsGatewayModule {}
