import { DataTypes } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import {
  Column,
  Model,
  Table,
  BelongsToMany,
  BeforeCreate,
} from 'sequelize-typescript';
import { ServerUser } from 'src/server-user/server-user.model';
import { User } from 'src/users/user.model';

@Table({ tableName: 'servers' })
export class Server extends Model {
  @Column({
    primaryKey: true,
    autoIncrement: true,
  })
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

  @Column({ defaultValue: 1 })
  totalMembers: number;

  @Column({ type: DataTypes.UUID, allowNull: false, defaultValue: uuidv4() })
  uuid: string;

  @BelongsToMany(() => User, () => ServerUser)
  members: User[];

  @BeforeCreate
  static generateUUID(instance: Server) {
    instance.uuid = uuidv4();
  }
}
