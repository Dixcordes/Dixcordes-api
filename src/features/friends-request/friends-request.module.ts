import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.model';
import { FriendsRequest } from '../friends-request/model/friend-request.model';
import { FriendsRequestService } from './friends-request.service';
import { FriendsRequestController } from './friends-request.controller';

@Module({
  imports: [SequelizeModule.forFeature([User, FriendsRequest])],
  providers: [FriendsRequestService, UsersService],
  controllers: [FriendsRequestController],
  exports: [SequelizeModule],
})
export class FriendsRequestModule {}
