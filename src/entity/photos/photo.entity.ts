import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class Photo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;
  static users: any;

  constructor(url: string) {
    this.url = url;
  }

  @OneToMany(() => User, (photo) => photo.users)
  users: User[];
}
