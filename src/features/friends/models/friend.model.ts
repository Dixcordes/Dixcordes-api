import { Table, Model, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from '../../users/user.model';

@Table({ tableName: 'friends' })
export class Friends extends Model {
  @ForeignKey(() => User)
  userId: number;

  @ForeignKey(() => User)
  friendId: number;

  @BelongsTo(() => User, 'userId')
  user: User;

  @BelongsTo(() => User, 'friendId')
  friend: User;
}
