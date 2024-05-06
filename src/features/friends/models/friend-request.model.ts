import { Table, Model, ForeignKey, Column } from 'sequelize-typescript';
import { User } from '../../users/user.model';

@Table({ tableName: 'friends-request' })
export class Friends extends Model {
  @ForeignKey(() => User)
  userId: number;

  @ForeignKey(() => User)
  friendId: number;

  @Column({ defaultValue: null })
  response: boolean;
}
