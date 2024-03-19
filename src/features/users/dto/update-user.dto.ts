import { UserDto } from './user.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateUserDto extends PartialType(UserDto) {
  firstName?: string;
  lastName?: string;
  photo?: string;
  email?: string;
  isAdmin?: boolean;
  password?: string;
}
