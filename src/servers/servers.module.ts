import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Server } from './server.model';
import { ServersController } from './servers.controller';
import { ServersService } from './servers.service';
import { ServerUser } from '../server-user/server-user.model';
import { User } from 'src/users/user.model';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [SequelizeModule.forFeature([Server, ServerUser, User])],
  providers: [ServersService, UsersService],
  controllers: [ServersController],
  exports: [SequelizeModule],
})
export class ServersModule {}

/*
IF I CAN'T CREATE SERVER WITH THE 
AUTHOR OF THE REQUEST OR SOMETHONG ELSE, LOOK AT THE EXPORTS
*/
