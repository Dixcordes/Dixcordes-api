import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Friends } from './models/friend.model';

@Module({
  imports: [SequelizeModule.forFeature([Friends])],
  exports: [SequelizeModule],
})
export class FriendsModule {}
