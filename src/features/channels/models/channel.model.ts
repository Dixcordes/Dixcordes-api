import { Column, DataType, Model, Table } from 'sequelize-typescript';

enum ChannelsType {
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

  // Create a column for invite user in the channels, create a server invite ?
}
