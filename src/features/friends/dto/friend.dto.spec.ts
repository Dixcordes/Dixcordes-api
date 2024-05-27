import { FriendDto } from './friend.dto';

describe('UpdateChannelDto', () => {
  it('should create a updateChannelDto object', () => {
    expect(new FriendDto(4, 8)).toEqual(new FriendDto(4, 8));
  });
});
