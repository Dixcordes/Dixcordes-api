import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';
import { UserDto } from './user.dto';
import * as bcrypt from 'bcrypt';

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
    return this.userModel.findOne({ where: { id } });
  }

  async findOneByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ where: { email } });
  }

  async create(userDto: UserDto): Promise<User> {
    try {
      if (userDto.firstName === undefined || userDto.lastName === undefined) {
        throw new HttpException(
          'firstName and lastName are required',
          HttpStatus.BAD_REQUEST,
        );
      } else if (userDto.email === undefined || userDto.email === '') {
        throw new HttpException('email is required', HttpStatus.BAD_REQUEST);
      } else if (userDto.email.includes('@') === false) {
        throw new HttpException(
          'email must be a valid email address',
          HttpStatus.BAD_REQUEST,
        );
      } else if (userDto.password === undefined || userDto.password === '') {
        throw new HttpException('password is required', HttpStatus.BAD_REQUEST);
      } else {
        const existingUser = await this.findOneByEmail(userDto.email);
        if (existingUser) {
          throw new HttpException(
            'email already exists',
            HttpStatus.BAD_REQUEST,
          );
        }
      }
      const saltOrRounds = 10;
      const hashedPassword = await bcrypt.hash(userDto.password, saltOrRounds);
      return await this.userModel.create({
        firstName: userDto.firstName,
        lastName: userDto.lastName,
        email: userDto.email,
        password: hashedPassword,
      });
    } catch (error) {
      throw error;
    }
  }
}
