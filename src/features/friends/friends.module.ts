import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Friends } from './models/friend.model';
import { FriendsService } from './friends.service';
import { FriendsController } from './friends.controller';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.model';

@Module({
  imports: [SequelizeModule.forFeature([Friends, User])],
  providers: [FriendsService, UsersService],
  controllers: [FriendsController],
  exports: [SequelizeModule],
})
export class FriendsModule {}
