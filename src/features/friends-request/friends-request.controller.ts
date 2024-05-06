import { Controller, Get, Param, Post, Request } from '@nestjs/common';
import { FriendsRequestService } from './friends-request.service';
import { FriendsRequest } from './model/friend-request.model';

@Controller('friendsRequest')
export class FriendsRequestController {
  constructor(private friendsRequestService: FriendsRequestService) {}

  @Get()
  findFriendRequest(
    @Param('addFriendIdRequest') addFriendIdRequest,
    @Request() req,
  ): Promise<FriendsRequest> {
    return this.friendsRequestService.findFriendRequest(
      req.user.sub,
      addFriendIdRequest,
    );
  }

  @Post('sendAddFriendRequest/:userEmailToAdd')
  addFriend(
    @Param('userEmailToAdd') userEmailToAdd,
    @Request() req,
  ): Promise<FriendsRequest> {
    return this.friendsRequestService.sendAddFriendRequest(
      req.user.sub,
      userEmailToAdd,
    );
  }
}
