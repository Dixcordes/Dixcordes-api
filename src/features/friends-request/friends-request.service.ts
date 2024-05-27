import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UsersService } from '../users/users.service';
import { FriendsRequest } from '../friends-request/model/friend-request.model';
import { Friends } from '../friends/models/friend.model';
import { FriendsRequestDto } from './dto/friend-request.dto';
import { FriendsService } from '../friends/friends.service';
import { FriendsSendRequestDto } from './dto/friend-send-request.dto';

@Injectable()
export class FriendsRequestService {
  constructor(
    @InjectModel(FriendsRequest)
    private friendRequestModel: typeof FriendsRequest,
    @InjectModel(Friends)
    private friendModel: typeof Friends,
    private usersService: UsersService,
    private friendsService: FriendsService,
  ) {}

  async findAll(): Promise<FriendsRequest[]> {
    return this.friendRequestModel.findAll();
  }

  async findAllUserRequest(userId: number): Promise<FriendsRequest[]> {
    return this.friendRequestModel.findAll({
      where: { from: userId },
    });
  }

  async findFriendRequest(
    userId: number,
    friendId: number,
  ): Promise<FriendsRequest> {
    try {
      const findUser = await this.usersService.findOne(userId);
      if (!findUser)
        throw new HttpException(
          'Error while sending request',
          HttpStatus.BAD_REQUEST,
        );
      const findUserToAdd = await this.usersService.findOne(friendId);
      if (!findUserToAdd)
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      const findRequest = await this.friendRequestModel.findOne({
        where: { to: findUserToAdd.id, from: findUser.id },
      });
      if (!findRequest)
        throw new HttpException('Request not found', HttpStatus.NOT_FOUND);
      return findRequest;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async sendAddFriendRequest(
    friendsSendRequestDto: FriendsSendRequestDto,
  ): Promise<FriendsRequest> {
    try {
      const findUser = await this.usersService.findOne(
        friendsSendRequestDto.from,
      );
      if (!findUser)
        throw new HttpException(
          'Error while sending request',
          HttpStatus.BAD_REQUEST,
        );
      const findUserToAdd = await this.usersService.findOneByEmail(
        friendsSendRequestDto.to,
      );
      if (!findUserToAdd)
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      if (friendsSendRequestDto.from === findUserToAdd.id)
        throw new HttpException(
          'You cannot add yourself as a friend...',
          HttpStatus.CONFLICT,
        );
      const isRequestAlreadySend = await this.friendRequestModel.findOne({
        where: { to: findUserToAdd.id },
      });
      if (
        isRequestAlreadySend?.from === findUser.id &&
        isRequestAlreadySend?.to === findUserToAdd.id
      )
        throw new HttpException('Request already send', HttpStatus.CONFLICT);
      const newFriendRequest = await this.friendRequestModel.create({
        from: findUser.id,
        to: findUserToAdd.id,
        answer: null,
      });
      return newFriendRequest;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async answerFriendRequest(
    friendRequestDto: FriendsRequestDto,
  ): Promise<Friends> {
    try {
      const alreadyFriend = await this.friendModel.findOne({
        where: {
          target_id: friendRequestDto.to,
          userId: friendRequestDto.from,
        },
      });
      if (alreadyFriend)
        throw new HttpException(
          'You are already friend with this user.',
          HttpStatus.BAD_REQUEST,
        );
      const findRequest = await this.findFriendRequest(
        friendRequestDto.from,
        friendRequestDto.to,
      );
      if (!findRequest)
        throw new HttpException('Request not found', HttpStatus.NOT_FOUND);
      if (friendRequestDto.to === findRequest.to) {
        if (friendRequestDto.answer === false) {
          await this.friendRequestModel.destroy({
            where: { from: friendRequestDto?.from, to: friendRequestDto?.to },
          });
          return;
        }
        if (friendRequestDto.answer === true)
          await this.friendRequestModel.destroy({
            where: { from: friendRequestDto.from, to: friendRequestDto.to },
          });
        return await this.friendModel.create({
          userId: friendRequestDto?.from,
          targetId: friendRequestDto?.to,
        });
      } else
        throw new HttpException(
          'You cannot accept this request.',
          HttpStatus.BAD_REQUEST,
        );
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
