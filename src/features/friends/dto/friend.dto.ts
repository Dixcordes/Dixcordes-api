export class FriendDto {
  userId: number;
  friendId: number;

  constructor(userId: number, friendId: number) {
    this.userId = userId;
    this.friendId = friendId;
  }
}
