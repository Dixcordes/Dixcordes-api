import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Friends } from './models/friend.model';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.model';

@Injectable()
export class FriendsService {
  constructor(
    @InjectModel(Friends)
    private friendModel: typeof Friends,
    private usersService: UsersService,
  ) {}

  async findAll(): Promise<Friends[]> {
    return this.friendModel.findAll();
  }

  async addFriend(userId: number, userEmailToAdd: string): Promise<Friends> {
    try {
      const findUser = await this.usersService.findOne(userId);
      if (!findUser)
        throw new HttpException(
          'Error while sending request',
          HttpStatus.BAD_REQUEST,
        );
      const findUserToAdd = await this.usersService.findOneByEmail(
        userEmailToAdd,
      );
      if (!findUserToAdd)
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      const requestAlreadySend = this.friendModel.findOne({
        where: { userId: findUser.id, friendId: findUserToAdd.id },
      });
      // Fix the requestAlreadySend and it's condition
      if (requestAlreadySend)
        throw new HttpException('Request already send', HttpStatus.CONFLICT);
      const newFriendRequest = await this.friendModel.create({
        userId: findUser.id,
        friendId: findUserToAdd.id,
      });
      return newFriendRequest;
    } catch (error) {
      throw error;
    }
  }
}
