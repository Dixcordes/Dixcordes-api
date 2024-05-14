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
}
