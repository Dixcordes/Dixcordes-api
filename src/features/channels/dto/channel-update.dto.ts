import { IsNumber } from 'class-validator';

export class UpdateChannelDto {
  name?: string;
  isPrivate?: boolean;
  @IsNumber()
  channelId: number;
}
