import { Table, Model, Column } from 'sequelize-typescript';

@Table({ tableName: 'friends' })
export class Friends extends Model {
  @Column
  userId: number;

  @Column
  friendId: number;
}
