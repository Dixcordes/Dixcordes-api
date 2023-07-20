import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';
import { UserDto } from './dto/user.dto';
import { FilesServices } from 'src/utils/files/files-utils.service';
import * as bcrypt from 'bcrypt';
import { join } from 'path';
import { promises as fsPromises } from 'fs';

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

  async create(userDto: UserDto): Promise<User> {
    const defaultPhoto = '/files/users/default/default_photo.png';
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
      } else if (userDto.email) {
        const existingUser = await this.findOneByEmail(userDto.email);
        if (existingUser) {
          throw new HttpException(
            'email already exists',
            HttpStatus.BAD_REQUEST,
          );
        }
      }
      switch (userDto.password) {
        case '123456':
          throw new HttpException(
            'password is too common',
            HttpStatus.BAD_REQUEST,
          );
        case 'password':
          throw new HttpException(
            'password is too common',
            HttpStatus.BAD_REQUEST,
          );
        case 'password123':
          throw new HttpException(
            'password is too common',
            HttpStatus.BAD_REQUEST,
          );
        case 'passw0rd':
          throw new HttpException(
            'password is too common',
            HttpStatus.BAD_REQUEST,
          );
        default:
          break;
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
    }
  }

  async update(
    id: number,
    userDto: UserDto,
    file: Express.Multer.File,
    tokenUserId: number,
  ): Promise<User> {
    const user = await this.findOne(id);
    let newPhoto;
    if (!user) {
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    } else if (user.id !== tokenUserId) {
      throw new HttpException(
        'you can only update your own user',
        HttpStatus.UNAUTHORIZED,
      );
    } else if (file != undefined || '' || null) {
      newPhoto = file.originalname;
    }
    await user.update({
      firstName: userDto.firstName,
      lastName: userDto.lastName,
      photo: `${process.env.DEV_URL}${process.env.API_VERSION}${process.env.UPLOAD_LOCATION}${newPhoto}`,
    });
    return user;
  }

  async delete(id: number): Promise<void> {
    const user = await this.findOne(id);
    if (!user) {
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    }
    await user.destroy();
    return null;
  }

  async UploadPhoto(file: Express.Multer.File): Promise<string> {
    const { originalname } = file;
    // use the method of files services to generate a unique filename
    const uniqueFileName = FilesServices.generateUniqueFileName(originalname);
    const destinationPath = join('files/users', uniqueFileName);
    // rename the file path to the destination path
    await fsPromises.rename(file.path, destinationPath);
    const imageUrl = `${process.env.DEV_URL} + ${process.env.API_VERSION} + ${uniqueFileName}`;
    return imageUrl;
  }
}
