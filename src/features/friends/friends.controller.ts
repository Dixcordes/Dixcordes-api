import { Controller, Get, Param, Post, Request } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { Friends } from './models/friend.model';
import { FriendsRequest } from './models/friend-request.model';

@Controller('friends')
export class FriendsController {
  constructor(private friendsService: FriendsService) {}

  @Get()
  findAll(): Promise<Friends[]> {
    return this.friendsService.findAll();
  }

  @Post('sendAddFriendRequest/:userEmailToAdd')
  addFriend(
    @Param('userEmailToAdd') userEmailToAdd,
    @Request() req,
  ): Promise<FriendsRequest> {
    return this.friendsService.sendAddFriendRequest(
      req.user.sub,
      userEmailToAdd,
    );
  }
}
