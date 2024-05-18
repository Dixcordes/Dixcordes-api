import { Body, Controller, Get, Param, Post, Request } from '@nestjs/common';
import { ChannelsService } from './channel.service';
import { Channels } from './models/channel.model';
import { ChannelDto } from './dto/channel.dto';

@Controller('channels')
export class ChannelsController {
  constructor(private channelsService: ChannelsService) {}

  @Get()
  findAll(): Promise<Channels[]> {
    return this.channelsService.findAll();
  }

  @Get(':name')
  findOneByName(@Param('name') name: string): Promise<Channels> {
    return this.channelsService.findOneByName(name);
  }

  @Post()
  createChannel(
    @Body() channelDto: ChannelDto,
    @Request() req,
  ): Promise<Channels> {
    return this.channelsService.createChannel(channelDto, req.user.sub);
  }
}
