import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/features/users/user.model';
import { UserDto } from 'src/features/users/dto/user.dto';
import { UpdateUserDto } from 'src/features/users/dto/update-user.dto';
import { UsersService } from 'src/features/users/users.service';
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
      if (userDto.email) {
        const existingUser = await this.usersService.findOneByEmail(
          userDto.email,
        );
        if (existingUser) {
          throw new HttpException('email already exists', HttpStatus.CONFLICT);
        }
      }
      const hashedPassword = await bcrypt.hashSync(
        userDto.password,
        bcrypt.genSaltSync(10),
      );
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

  async SignIn(
    updateUserDto: UpdateUserDto,
  ): Promise<{ access_token: string }> {
    try {
      if (updateUserDto.email === undefined || updateUserDto.email === '') {
        throw new HttpException('email is required', HttpStatus.BAD_REQUEST);
      } else if (
        updateUserDto.password === undefined ||
        updateUserDto.password === ''
      ) {
        throw new HttpException('password is required', HttpStatus.BAD_REQUEST);
      } else if (updateUserDto.email) {
        const existingUser = await this.usersService.findOneByEmail(
          updateUserDto.email,
        );
        if (!existingUser) {
          throw new HttpException('email does not exist', HttpStatus.NOT_FOUND);
        }
        const isMatch = await bcrypt.compare(
          updateUserDto.password,
          existingUser.password,
        );
        if (!isMatch) {
          throw new HttpException(
            'password is incorrect',
            HttpStatus.UNAUTHORIZED,
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
