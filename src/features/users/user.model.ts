import {
  Column,
  Model,
  Table,
  BelongsToMany,
  HasMany,
} from 'sequelize-typescript';
import { Server } from '../servers/server.model';
import { ServerUser } from 'src/features/server-user/server-user.model';
import { Friends } from '../friends/models/friend.model';
import { FriendsRequest } from '../friends-request/model/friend-request.model';

@Table({ tableName: 'users' })
export class User extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column
  firstName: string;

  @Column
  lastName: string;

  @Column
  photo: string;

  @Column
  email: string;

  @Column
  password: string;

  @Column({ defaultValue: false })
  isAdmin: boolean;

  @Column({ defaultValue: true })
  isActive: boolean;

  @BelongsToMany(() => Server, () => ServerUser)
  servers: Server[];

  @HasMany(() => Friends)
  friends: Friends[];

  @HasMany(() => FriendsRequest)
  friendsRequest: FriendsRequest[];
}
