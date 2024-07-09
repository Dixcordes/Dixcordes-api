import { MessageDto } from './message.dto';

describe('UpdateChannelDto', () => {
  it('should create a MessageDto object', () => {
    return expect(
      new MessageDto(
        'Test author name',
        'Test user received message',
        'This i a test content message.',
        (21 / 4 / 2024) as unknown as Date,
      ),
    ).toEqual(
      new MessageDto(
        'Test author name',
        'Test user received message',
        'This i a test content message.',
        (21 / 4 / 2024) as unknown as Date,
      ),
    );
  });
});
