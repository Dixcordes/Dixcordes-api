export class FriendsSendRequestDto {
  from: number;
  to: string;

  constructor(from: number, to: string) {
    this.from = from;
    this.to = to;
  }
}
