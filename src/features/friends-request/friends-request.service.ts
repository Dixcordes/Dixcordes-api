import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UsersService } from '../users/users.service';
import { FriendsRequest } from '../friends-request/model/friend-request.model';
import { Friends } from '../friends/models/friend.model';
import { FriendsRequestDto } from './dto/friend-request.dto';

@Injectable()
export class FriendsRequestService {
  constructor(
    @InjectModel(FriendsRequest)
    private friendRequestModel: typeof FriendsRequest,
    @InjectModel(Friends)
    private friendModel: typeof Friends,
    private usersService: UsersService,
  ) {}

  async findAll(): Promise<FriendsRequest[]> {
    return this.friendRequestModel.findAll();
  }

  async findAllUSerRequest(userId: number): Promise<FriendsRequest[]> {
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
        where: { to: findUserToAdd.id },
      });
      if (
        findRequest?.from === findUser.id &&
        findRequest?.to === findUserToAdd.id
      )
        return findRequest;
      else throw new HttpException('Request not found', HttpStatus.NOT_FOUND);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async sendAddFriendRequest(
    userId: number,
    userEmailToAdd: string,
  ): Promise<FriendsRequest> {
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
      if (userId === findUserToAdd.id)
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

  async acceptRequest(friendRequestDto: FriendsRequestDto): Promise<Friends> {
    try {
      const findRequest = await this.findFriendRequest(
        friendRequestDto.from,
        friendRequestDto.to,
      );
      if (!findRequest)
        throw new HttpException('Request not found', HttpStatus.NOT_FOUND);
      if (friendRequestDto.answer === false)
        throw new HttpException(
          'Error while accepting the request',
          HttpStatus.BAD_REQUEST,
        );
      const newFriend = await this.friendModel.create({
        userId: friendRequestDto?.from,
        targetId: friendRequestDto?.to,
      });
      return newFriend;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async refuseRequest(friendRequestDto: FriendsRequestDto) {
    try {
      const findRequest = await this.findFriendRequest(
        friendRequestDto.from,
        friendRequestDto.to,
      );
      if (!findRequest)
        throw new HttpException('Request not found', HttpStatus.NOT_FOUND);
      if (friendRequestDto.answer === true)
        throw new HttpException(
          'Error while refusing the request',
          HttpStatus.BAD_REQUEST,
        );
      const deleteRequest = await this.friendRequestModel.destroy({
        where: { from: friendRequestDto.from, to: friendRequestDto.to },
      });
      return deleteRequest;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
