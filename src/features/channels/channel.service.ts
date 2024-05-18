import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Channels } from './models/channel.model';
import { ChannelDto } from './dto/channel.dto';
import { Server } from '../servers/server.model';
import { User } from '../users/user.model';

@Injectable()
export class ChannelsService {
  constructor(
    @InjectModel(Channels)
    private channelModel: typeof Channels,
    @InjectModel(Server)
    private serverModel: typeof Server,
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async findAll(): Promise<Channels[]> {
    return this.channelModel.findAll();
  }

  async findOneByName(name: string): Promise<Channels> {
    return this.channelModel.findOne({
      where: { name: name },
    });
  }

  async createChannel(
    channelDto: ChannelDto,
    userId: number,
  ): Promise<Channels> {
    try {
      const server = await this.serverModel.findOne({
        where: { id: channelDto.serverId },
      });
      if (!server)
        throw new HttpException('Server not found', HttpStatus.NOT_FOUND);
      const user = await this.userModel.findOne({
        where: { id: userId },
      });
      if (!user)
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      if (server.admin != userId)
        throw new HttpException(
          "You don't have the right to do this action.",
          HttpStatus.BAD_REQUEST,
        );
      const newChannel = await this.channelModel.create({
        name: channelDto.name,
        type: channelDto.type,
        isPrivate: channelDto.isPrivate,
      });

      await newChannel.$set('server', server, {
        through: { server: server.id },
      });
      return newChannel;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
