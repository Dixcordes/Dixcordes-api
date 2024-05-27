import { ChannelsType } from '../models/channel.model';
import { ChannelDto } from './channel.dto';

describe('UpdateChannelDto', () => {
  it('should create a updateChannelDto object', () => {
    expect(
      new ChannelDto('test update channel', false, ChannelsType.textual, 4),
    ).toEqual(
      new ChannelDto('test update channel', false, ChannelsType.textual, 4),
    );
  });
});
