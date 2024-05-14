import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Channels } from './models/channel.model';
import { ChannelsService } from './channel.service';
import { ChannelsController } from './channel.controller';
import { Server } from '../servers/server.model';
import { User } from '../users/user.model';

@Module({
  imports: [SequelizeModule.forFeature([Channels, Server, User])],
  providers: [ChannelsService],
  controllers: [ChannelsController],
})
export class ChannelsModule {}
