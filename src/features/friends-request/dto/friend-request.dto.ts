export class FriendsRequestDto {
  from: number;
  to: number;
  answer: boolean;

  constructor(from: number, to: number, answer: boolean) {
    this.from = from;
    this.to = to;
    this.answer = answer;
  }
}
