import {
  Column,
  Model,
  Table,
  HasMany,
  ForeignKey,
  BelongsTo,
  BelongsToMany,
} from 'sequelize-typescript';
import { Server } from '../servers/server.model';
import { DataTypes } from 'sequelize';
import { ServerUser } from 'src/server-user/server-user.model';

@Table({ tableName: 'users' })
export class User extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column
  firstName: string;

  @Column
  lastName: string;

  @Column
  email: string;

  @Column
  password: string;

  @Column({ defaultValue: false })
  isAdmin: boolean;

  @Column({ defaultValue: true })
  isActive: boolean;

  @BelongsToMany(() => User, () => ServerUser)
  users: User[];
}
