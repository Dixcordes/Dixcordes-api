import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { UserDto } from 'src/users/dto/user.dto';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/user.model';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  create(@Body() userDto: UserDto): Promise<User> {
    return this.usersService.create(userDto);
  }

  // @Post('login')
  // login(@Body() userDto: UserDto): Promise<User> {
  //   return this.usersService.login(userDto);
  // }

  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Get(':email')
  findOneByEmail(@Param('email') email: string): Promise<User> {
    return this.usersService.findOneByEmail(email);
  }
}
