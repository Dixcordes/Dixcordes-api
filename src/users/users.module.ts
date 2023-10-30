import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './user.model';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { FilesServices } from 'src/utils/files/files-utils.service';

@Module({
  imports: [SequelizeModule.forFeature([User])],
  providers: [UsersService, JwtService, ConfigService, FilesServices],
  controllers: [UsersController],
  exports: [SequelizeModule],
})
export class UsersModule {}
