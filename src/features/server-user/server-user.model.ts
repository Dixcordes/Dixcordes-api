import { Column, Model, Table, ForeignKey } from 'sequelize-typescript';
import { Server } from '../servers/server.model';
import { User } from '../users/user.model';

@Table({ tableName: 'server_user' })
export class ServerUser extends Model {
  @ForeignKey(() => Server)
  @Column
  serverId: number;

  @ForeignKey(() => User)
  @Column
  userId: number;
}
