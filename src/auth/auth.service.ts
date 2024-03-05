import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/users/user.model';
import { UserDto } from 'src/users/dto/user.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async SignUp(userDto: UserDto): Promise<User> {
    const defaultPhoto = '/files/users/default/default_photo.png';
    try {
      if (userDto.firstName === undefined || userDto.lastName === undefined) {
        throw new HttpException(
          'firstName and lastName are required',
          HttpStatus.BAD_REQUEST,
        );
      }
      if (userDto.email === undefined || userDto.email === '') {
        throw new HttpException('email is required', HttpStatus.BAD_REQUEST);
      }
      if (userDto.email) {
        const existingUser = await this.usersService.findOneByEmail(
          userDto.email,
        );
        if (existingUser) {
          throw new HttpException(
            'email already exists',
            HttpStatus.BAD_REQUEST,
          );
        }
      }
      if (userDto.password === undefined || userDto.password === '') {
        throw new HttpException('password is required', HttpStatus.BAD_REQUEST);
      }
      const saltOrRounds = 10;
      const hashedPassword = await bcrypt.hash(userDto.password, saltOrRounds);
      return await this.userModel.create({
        firstName: userDto.firstName,
        lastName: userDto.lastName,
        email: userDto.email,
        photo: defaultPhoto,
        password: hashedPassword,
      });
    } catch (error) {
      throw error;
    } finally {
      console.log('User Sign Up Attempted');
    }
  }

  async SignIn(userDto: UserDto): Promise<{ access_token: string }> {
    try {
      if (userDto.email === undefined || userDto.email === '') {
        throw new HttpException('email is required', HttpStatus.BAD_REQUEST);
      } else if (userDto.password === undefined || userDto.password === '') {
        throw new HttpException('password is required', HttpStatus.BAD_REQUEST);
      } else if (userDto.email) {
        const existingUser = await this.usersService.findOneByEmail(
          userDto.email,
        );
        if (!existingUser) {
          throw new HttpException(
            'email does not exist',
            HttpStatus.BAD_REQUEST,
          );
        }
        const isMatch = await bcrypt.compare(
          userDto.password,
          existingUser.password,
        );
        if (!isMatch) {
          throw new HttpException(
            'password is incorrect',
            HttpStatus.BAD_REQUEST,
          );
        }
        const payload = {
          sub: existingUser.id,
          firstName: existingUser.firstName,
          lastName: existingUser.lastName,
        };
        return {
          access_token: await this.jwtService.signAsync(payload),
        };
      }
    } catch (error) {
      throw error;
    } finally {
      console.log('User Sign In Attempted');
    }
  }
}
