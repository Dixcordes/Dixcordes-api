export class ServerDeleteDto {
  serverId: number;
  serverName: string;

  constructor(serverId: number, serverName: string) {
    this.serverId = serverId;
    this.serverName = serverName;
  }
}
