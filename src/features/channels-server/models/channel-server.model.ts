import { Column, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Channels } from '../../channels/models/channel.model';
import { Server } from '../../servers/server.model';

@Table({ tableName: 'channel-server' })
export class ChannelsServers extends Model {
  @ForeignKey(() => Channels)
  @Column
  channel_id: number;

  @ForeignKey(() => Server)
  @Column
  server_id: number;
}
