import { FriendsSendRequestDto } from './friend-send-request.dto';

describe('UpdateChannelDto', () => {
  it('should create a updateChannelDto object', () => {
    expect(
      new FriendsSendRequestDto(
        14,
        'useremailreceivingthefriendrequest@mail.com',
      ),
    ).toEqual(
      new FriendsSendRequestDto(
        14,
        'useremailreceivingthefriendrequest@mail.com',
      ),
    );
  });
});
