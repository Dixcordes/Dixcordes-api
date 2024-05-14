import { ChannelsType } from '../models/channel.model';

export class ChannelDto {
  name: string;
  isPrivate: boolean;
  type: ChannelsType;
}
