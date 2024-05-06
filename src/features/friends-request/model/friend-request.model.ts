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
  from: number;

  @ForeignKey(() => User)
  to: number;

  @BelongsTo(() => User, 'from')
  user: User;

  @BelongsTo(() => User, 'to')
  friend: User;

  @Column({ defaultValue: null })
  answer: boolean;
}
