import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { UserDto } from 'src/users/user.dto';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/user.model';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  create(@Body() userDto: UserDto): Promise<User> {
    console.log('userDto', userDto);
    return this.usersService.create(userDto);
  }

  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }
}
