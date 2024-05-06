import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UsersService } from '../users/users.service';
import { FriendsRequest } from '../friends-request/model/friend-request.model';

@Injectable()
export class FriendsRequestService {
  constructor(
    @InjectModel(FriendsRequest)
    private friendRequestModel: typeof FriendsRequest,
    private usersService: UsersService,
  ) {}

  async findAll(): Promise<FriendsRequest[]> {
    return this.friendRequestModel.findAll();
  }

  async findFriendRequest(
    userId: number,
    friendId: number,
  ): Promise<FriendsRequest> {
    try {
      const findUserRequest = await this.friendRequestModel.findOne({
        where: { userId: userId },
      });
      const findFriendToAddRequest = await this.friendRequestModel.findOne({
        where: { friendId: friendId },
      });
      const findRequest = await this.friendRequestModel.findOne({
        where: { friendId: findUserRequest.id },
      });
      if (
        findRequest?.userId === findUserRequest.id &&
        findRequest?.friendId === findFriendToAddRequest.id
      )
        return findRequest;
    } catch (error) {
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
        where: { friendId: findUserToAdd.id },
      });
      if (
        isRequestAlreadySend?.userId === findUser.id &&
        isRequestAlreadySend?.friendId === findUserToAdd.id
      )
        throw new HttpException('Request already send', HttpStatus.CONFLICT);
      const newFriendRequest = await this.friendRequestModel.create({
        userId: findUser.id,
        friendId: findUserToAdd.id,
        response: null,
      });
      return newFriendRequest;
    } catch (error) {
      throw error;
    }
  }

  // async acceptRequest(
  //   userId: number,
  //   friendId: number,
  //   isAccepted: boolean,
  // ): Promise<Friends> {
  //   try {
  //     const findRequest = this.friendRequestModel.findOne({
  //       where: { userId: userId },
  //     });
  //     if (!findRequest)
  //       throw new HttpException('Request not found', HttpStatus.NOT_FOUND);
  //     if (isAccepted === false)
  //       throw new HttpException(
  //         'Error while accepting the request',
  //         HttpStatus.BAD_REQUEST,
  //       );
  //     const newFriend = await this.friendModel.create({
  //       userId:
  //     })
  //   } catch (error) {
  //     throw error;
  //   }
  // }
}
