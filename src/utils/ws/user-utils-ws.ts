import { Socket } from 'socket.io';
import { UsersService } from '../../features/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../features/users/user.model';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserUtilsWs {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async FindUserFromWsHandshake(socket: Socket): Promise<User> {
    try {
      const token = socket.handshake.headers.authorization;
      const decodedToken = await this.jwtService.verifyAsync(token);
      const findUser = await this.usersService.findOne(decodedToken.sub);
      if (!findUser) throw new Error('User not found');
      return findUser;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
