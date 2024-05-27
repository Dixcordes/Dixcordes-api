import { UserDto } from './user.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateUserDto extends PartialType(UserDto) {
  firstName?: string;
  lastName?: string;
  photo?: string;
  email?: string;
  isAdmin?: boolean;
  password?: string;

  constructor(
    firstName: string,
    lastName: string,
    photo: string,
    email: string,
    password: string,
  ) {
    super(firstName, lastName, photo, email, password);
    this.firstName = firstName;
    this.lastName = lastName;
    this.photo = photo;
    this.email = email;
    this.password = password;
  }
}
