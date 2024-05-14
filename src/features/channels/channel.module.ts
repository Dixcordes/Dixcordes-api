import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Channels } from './models/channel.model';
import { ChannelsService } from './channel.service';
import { ChannelsController } from './channel.controller';

@Module({
  imports: [SequelizeModule.forFeature([Channels])],
  providers: [ChannelsService],
  controllers: [ChannelsController],
})
export class ChannelsModule {}
