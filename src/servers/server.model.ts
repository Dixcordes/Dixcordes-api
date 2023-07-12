import { Column, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'servers' })
export class Server extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column
  name: string;

  @Column
  photo: string;

  @Column
  admin: string;

  @Column({ defaultValue: false })
  isPublic: boolean;

  @Column({ defaultValue: true })
  isActive: boolean;

  @Column({ defaultValue: 0 })
  totalMembers: number;

  @Column({ defaultValue: '' })
  members: string;

}
