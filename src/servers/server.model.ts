import { Column, Model, Table, BelongsToMany } from 'sequelize-typescript';
import { ServerUser } from 'src/server-user/server-user.model';

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

  @BelongsToMany(() => Server, () => ServerUser)
  servers: Server[];
}
