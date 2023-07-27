import { Module } from '@nestjs/common';
import { MyGateway } from './gateway';
import { UsersService } from 'src/users/users.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [UsersModule],
  providers: [MyGateway, UsersService],
})
export class GatewayModule {}
