import { Table, Model, ForeignKey, Column } from 'sequelize-typescript';
import { User } from '../../users/user.model';

@Table({ tableName: 'friends' })
export class Friends extends Model {
  @ForeignKey(() => User)
  @Column({ allowNull: false, unique: false, field: 'user_id' })
  userId: number;

  @ForeignKey(() => User)
  @Column({ allowNull: false, unique: false, field: 'target_id' })
  targetId: number;

  // @BelongsTo(() => User, 'userId')
  // user: User;

  // @BelongsTo(() => User, 'targetId')
  // friend: User;
}
