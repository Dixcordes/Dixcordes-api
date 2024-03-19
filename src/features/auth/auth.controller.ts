import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDto } from 'src/features/users/dto/user.dto';
import { UpdateUserDto } from '../users/dto/update-user.dto';
import { Public } from 'src/core/decorator/public.decorator';
import { User } from '../users/user.model';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('signup')
  signUp(@Body() userDto: UserDto): Promise<User> {
    return this.authService.SignUp(userDto);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  signIn(
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<{ access_token: string }> {
    return this.authService.SignIn(updateUserDto);
  }

  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
