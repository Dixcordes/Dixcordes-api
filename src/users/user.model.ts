import { Column, Model, Table, HasOne } from 'sequelize-typescript';
import { Photo } from '../photos/photo.model';

@Table({ tableName: 'users' })
export class User extends Model {
  static findOneByEmail(email: string) {
    throw new Error('Method not implemented.');
  }
  static findById(id: number): User | PromiseLike<User> {
    throw new Error('Method not implemented.');
  }
  @Column
  firstName: string;

  @Column
  lastName: string;

  @Column
  email: string;

  @Column
  password: string;

  @Column({ defaultValue: true })
  isActive: boolean;

  // @HasOne(() => Photo)
  // photo: Photo;
}
