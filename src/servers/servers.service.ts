import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Server } from './server.model';
import { ServerDto } from './dto/server.dto';
import { ServerUser } from '../server-user/server-user.model';
import { User } from 'src/users/user.model';

@Injectable()
export class ServersService {
  constructor(
    @InjectModel(Server)
    private serverModel: typeof Server,
    @InjectModel(User)
    private userModel: typeof User,
    @InjectModel(ServerUser)
    private serverUserModel: typeof ServerUser,
  ) {}

  async createServer(serverDto: ServerDto, req: string): Promise<Server> {
    try {
      if (serverDto.name === undefined || serverDto.name === '') {
        throw new HttpException('name is required', HttpStatus.BAD_REQUEST);
      } else if (serverDto.photo === undefined || serverDto.photo === '') {
        serverDto.photo = '';
      }
      const serverCreator = req;
      const server = await this.serverModel.create({
        name: serverDto.name,
        photo: serverDto.photo,
        admin: serverCreator,
        servers: [serverCreator, serverDto.members],
        isPublic: serverDto.isPublic,
        isActive: serverDto.isActive,
        totalMembers: serverDto.totalMembers,
      });

      const users = await this.userModel.findAll({
        where: { id: req },
      });

      await server.$set('members', users, {
        through: { active: true },
      });
      return server;
    } catch (error) {
      throw error;
    }
  }
}
