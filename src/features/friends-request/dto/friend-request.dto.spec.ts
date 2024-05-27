import { FriendsRequestDto } from './friend-request.dto';

describe('UpdateChannelDto', () => {
  it('should create a updateChannelDto object', () => {
    expect(new FriendsRequestDto(4, 8, null)).toEqual(
      new FriendsRequestDto(4, 8, null),
    );
  });
});
