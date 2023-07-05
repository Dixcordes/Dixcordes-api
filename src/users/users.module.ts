import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './user.model';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [SequelizeModule.forFeature([User])],
  providers: [UsersService, JwtService],
  controllers: [UsersController],
  exports: [SequelizeModule],
})
export class UsersModule {}
