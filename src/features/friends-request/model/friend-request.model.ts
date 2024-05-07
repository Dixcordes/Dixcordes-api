import { Table, Model, ForeignKey, Column } from 'sequelize-typescript';
import { User } from '../../users/user.model';

@Table({ tableName: 'friends-request' })
export class FriendsRequest extends Model {
  @ForeignKey(() => User)
  @Column({ allowNull: false, unique: false, field: 'from' })
  from: number;

  @ForeignKey(() => User)
  @Column({ allowNull: false, unique: false, field: 'to' })
  to: number;

  // @BelongsTo(() => User, 'from')
  // user: User;

  // @BelongsTo(() => User, 'to')
  // friend: User;

  @Column({ defaultValue: null })
  answer: boolean;
}
