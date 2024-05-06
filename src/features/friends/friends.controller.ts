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
}
