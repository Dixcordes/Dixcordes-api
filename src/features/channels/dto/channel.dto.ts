import { ChannelsType } from '../models/channel.model';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ChannelDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  isPrivate: boolean;

  @IsNotEmpty()
  type: ChannelsType;

  @IsNotEmpty()
  @IsNumber()
  serverId: number;

  constructor(
    name: string,
    isPrivate: boolean,
    type: ChannelsType,
    serverId: number,
  ) {
    this.name = name;
    this.isPrivate = isPrivate;
    this.type = type;
    this.serverId = serverId;
  }
}
