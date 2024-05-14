import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Channels } from './models/channel.model';
import { ChannelDto } from './dto/channel.dto';

@Injectable()
export class ChannelsService {
  constructor(
    @InjectModel(Channels)
    private channelModel: typeof Channels,
  ) {}

  async findAll(): Promise<Channels[]> {
    return this.channelModel.findAll();
  }

  async createChannel(channelDto: ChannelDto): Promise<Channels> {
    try {
      const newChannel = await this.channelModel.create({
        name: channelDto.name,
        type: channelDto.type,
        isPrivate: channelDto.isPrivate,
      });
      return newChannel;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
