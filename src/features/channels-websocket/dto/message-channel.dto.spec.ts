import { MessageInChannelDto } from './message-channel.dto';

describe('UpdateChannelDto', () => {
  it('should create a updateChannelDto object', () => {
    expect(
      new MessageInChannelDto(
        'test channel name',
        'This is a test message',
        'User for author test',
      ),
    ).toEqual(
      new MessageInChannelDto(
        'test channel name',
        'This is a test message',
        'User for author test',
      ),
    );
  });
});
