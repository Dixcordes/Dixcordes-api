import { Module } from '@nestjs/common';
import { MyGateway } from './gateway';
import { UsersService } from 'src/users/users.service';
import { UsersModule } from 'src/users/users.module';
import { ServersModule } from 'src/servers/servers.module';
import { ServersService } from 'src/servers/servers.service';

@Module({
  imports: [UsersModule, ServersModule],
  providers: [MyGateway, UsersService, ServersService],
})
export class GatewayModule {}
