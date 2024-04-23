import { Controller, Get, Param, Post, Request } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { Friends } from './models/friend.model';

@Controller('friends')
export class FriendsController {
  constructor(private friendsService: FriendsService) {}

  @Get()
  findAll(): Promise<Friends[]> {
    return this.friendsService.findAll();
  }

  @Post('add/:userEmailToAdd')
  addFriend(
    @Param('userEmailToAdd') userEmailToAdd,
    @Request() req,
  ): Promise<Friends> {
    return this.friendsService.addFriend(req.user.sub, userEmailToAdd);
  }
}
