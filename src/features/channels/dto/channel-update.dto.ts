import { IsNumber } from 'class-validator';

export class UpdateChannelDto {
  name?: string;
  isPrivate?: boolean;
  @IsNumber()
  channelId: number;

  constructor(name: string, isPrivate: boolean, channelId: number) {
    this.name = name;
    this.isPrivate = isPrivate;
    this.channelId = channelId;
  }
}
