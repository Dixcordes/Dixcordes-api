import { Table, Model, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from '../../users/user.model';

@Table({ tableName: 'friends' })
export class Friends extends Model {
  @ForeignKey(() => User)
  userId: number;

  @ForeignKey(() => User)
  targetId: number;

  @BelongsTo(() => User, 'userId')
  user: User;

  @BelongsTo(() => User, 'targetId')
  friend: User;
}
