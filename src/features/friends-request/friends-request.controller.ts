import { Body, Controller, Get, Param, Post, Request } from '@nestjs/common';
import { FriendsRequestService } from './friends-request.service';
import { FriendsRequest } from './model/friend-request.model';
import { FriendsRequestDto } from './dto/friend-request.dto';
import { Friends } from '../friends/models/friend.model';

@Controller('friendsRequest')
export class FriendsRequestController {
  constructor(private friendsRequestService: FriendsRequestService) {}

  @Get('findAllRequest')
  findAllUserRequest(@Request() req): Promise<FriendsRequest[]> {
    return this.friendsRequestService.findAllUSerRequest(req.user.sub);
  }

  @Get('findOneRequest/:addFriendIdRequest')
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

  @Post('answerFriendRequest')
  answerFriendRequest(
    @Request() req,
    @Body() friendsRequestDto: FriendsRequestDto,
  ): Promise<Friends> {
    friendsRequestDto = {
      to: req.user.sub,
      from: friendsRequestDto.from,
      answer: friendsRequestDto.answer,
    };
    return this.friendsRequestService.answerFriendRequest(friendsRequestDto);
  }
}
