import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';
import { ChannelsServers } from '../../channels-server/models/channel-server.model';
import { Server } from '../../servers/server.model';

export enum ChannelsType {
  textual = 'text',
  voice = 'voice',
}

@Table({ tableName: 'channels' })
export class Channels extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column
  name: string;

  @Column({ defaultValue: false })
  isPrivate: boolean;

  @Column({
    defaultValue: ChannelsType.textual,
    type: DataType.ENUM(...Object.values(ChannelsType)),
  })
  type: ChannelsType;

  @BelongsToMany(() => Server, () => ChannelsServers)
  server: Server[];

  // Create a column for invite user in the channels, create a server invite ?
}
