import { Column, Model, Table, HasOne } from 'sequelize-typescript';
import { User } from '../users/user.model';

@Table
export class Photo extends Model {
  @Column
  firstName: string;

  @Column
  lastName: string;

  @Column({ defaultValue: true })
  isActive: boolean;

  // @HasOne(() => User)
  // user: User;
}
