import {
  Table,
  Model,
  ForeignKey,
  Column,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from '../../users/user.model';

@Table({ tableName: 'friends-request' })
export class FriendsRequest extends Model {
  @ForeignKey(() => User)
  userId: number;

  @ForeignKey(() => User)
  friendId: number;

  @BelongsTo(() => User, 'userId')
  user: User;

  @BelongsTo(() => User, 'friendId')
  friend: User;

  @Column({ defaultValue: null })
  response: boolean;
}
