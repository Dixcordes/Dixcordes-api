import { UpdateUserDto } from './update-user.dto';

describe('UpdateChannelDto', () => {
  it('should create a updateChannelDto object', () => {
    expect(
      new UpdateUserDto(
        'Test user firstName for update',
        'User-lastName',
        null,
        'newUserEmail@mail.com',
        '',
      ),
    ).toEqual(
      new UpdateUserDto(
        'Test user firstName for update',
        'User-lastName',
        null,
        'newUserEmail@mail.com',
        '',
      ),
    );
  });
});
