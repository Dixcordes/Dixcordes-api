import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Channels } from './models/channel.model';
import { ChannelsService } from './channel.service';

@Module({
  imports: [SequelizeModule.forFeature([Channels])],
  providers: [ChannelsService],
})
export class ChannelsModule {}
