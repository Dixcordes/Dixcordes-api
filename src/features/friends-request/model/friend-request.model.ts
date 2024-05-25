import { Table, Model, ForeignKey, Column } from 'sequelize-typescript';
import { User } from '../../users/user.model';

@Table({ tableName: 'friends-request' })
export class FriendsRequest extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @ForeignKey(() => User)
  @Column({ allowNull: false, field: 'from' })
  from: number;

  @ForeignKey(() => User)
  @Column({ allowNull: false, field: 'to' })
  to: number;

  @Column({ defaultValue: null })
  answer: boolean;
}
