import { UpdateChannelDto } from './channel-update.dto';

describe('UpdateChannelDto', () => {
  it('should create a updateChannelDto object', () => {
    expect(new UpdateChannelDto('test update channel', false, 4)).toEqual(
      new UpdateChannelDto('test update channel', false, 4),
    );
  });
});
