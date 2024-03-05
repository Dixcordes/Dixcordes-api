import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';
import { UserDto } from './dto/user.dto';
import * as fs from 'fs';

@Injectable()
export class UsersService {
  usersService: any;
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userModel.findAll();
  }

  async findOne(id: number): Promise<User> {
    return await this.userModel.findOne({ where: { id } });
  }

  async findOneByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ where: { email } });
  }

  async update(
    id: number,
    userDto: UserDto,
    file: Express.Multer.File,
    tokenUserId: number,
  ): Promise<User> {
    const user = await this.findOne(id);
    if (!user) {
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    } else if (user.id !== tokenUserId) {
      throw new HttpException(
        'you can only update your own user',
        HttpStatus.UNAUTHORIZED,
      );
    }
    if (userDto.firstName == undefined || userDto.firstName == '') {
      userDto.firstName = user.firstName;
    }
    if (userDto.lastName == undefined || userDto.lastName == '') {
      userDto.lastName = user.lastName;
    }
    if (file !== undefined && file !== null) {
      userDto.photo = file.path;
      if (user.photo !== '/files/users/default/default_photo.png') {
        fs.unlinkSync(user.photo);
      }
    } else if (file === undefined || file === null) userDto.photo = user.photo;
    await user.update({
      firstName: userDto.firstName,
      lastName: userDto.lastName,
      photo: userDto.photo,
    });
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      photo: user.photo,
    } as User;
  }

  async delete(id: number): Promise<void> {
    const user = await this.findOne(id);
    if (!user) {
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    }
    await user.destroy();
    return null;
  }
}
