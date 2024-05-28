import { UserDto } from './user.dto';

describe('UpdateChannelDto', () => {
  it('should create a updateChannelDto object', () => {
    expect(
      new UserDto(
        'Test user firstName for update',
        'User-lastName',
        null,
        'newUserEmail@mail.com',
        'userpasswordinclearbecauseitsjusttesting',
      ),
    ).toEqual(
      new UserDto(
        'Test user firstName for update',
        'User-lastName',
        null,
        'newUserEmail@mail.com',
        'userpasswordinclearbecauseitsjusttesting',
      ),
    );
  });
});
