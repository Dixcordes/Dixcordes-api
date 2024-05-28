export class ServerAccessDto {
  userId: number;
  serverId: number;

  constructor(userId: number, serverId: number) {
    this.userId = userId;
    this.serverId = serverId;
  }
}
