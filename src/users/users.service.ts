import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';
import { UserDto } from './user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  create(userDto: UserDto): Promise<User> {
    if (userDto.firstName === undefined || userDto.lastName === undefined) {
      return Promise.reject(new Error('firstName and lastName are required'));
    }
    return this.userModel.create({
      firstName: userDto.firstName,
      lastName: userDto.lastName,
      email: userDto.email,
    });
  }

  async findAll(): Promise<User[]> {
    return this.userModel.findAll();
  }
}
