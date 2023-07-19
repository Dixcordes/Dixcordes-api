import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Server } from './server.model';
import { ServerDto } from './dto/server.dto';
import { User } from 'src/users/user.model';

@Injectable()
export class ServersService {
  constructor(
    @InjectModel(Server)
    private serverModel: typeof Server,
    @InjectModel(User)
    private userModel: typeof User,
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

  async joinServer(serverId: number, req: string): Promise<Server> {
    try {
      const server = await this.serverModel.findOne({
        where: { id: serverId },
      });
      const user = await this.userModel.findOne({
        where: { id: req },
      });
      if (!server) {
        throw new HttpException('server not found', HttpStatus.NOT_FOUND);
      } else if (!user) {
        throw new HttpException('user not found', HttpStatus.NOT_FOUND);
      }

      const updatedServer = await this.serverModel.update(
        {
          totalMembers: server.totalMembers + 1,
        },
        {
          where: { id: serverId },
          returning: true, // This ensures that the updated server is returned
        },
      );

      const updatedServerData = updatedServer[1][0];

      await updatedServerData.$add('members', user, {
        through: { active: true },
      });
      return server;
    } catch (error) {
      throw error;
    }
  }

  async leaveServer(serverId: number, req: string): Promise<Server> {
    try {
      const server = await this.serverModel.findOne({
        where: { id: serverId },
      });
      const user = await this.userModel.findOne({
        where: { id: req },
      });
      if (!server) {
        throw new HttpException('server not found', HttpStatus.NOT_FOUND);
      } else if (!user) {
        throw new HttpException('user not found', HttpStatus.NOT_FOUND);
      }

      const updatedServer = await this.serverModel.update(
        {
          totalMembers: server.totalMembers - 1,
        },
        {
          where: { id: serverId },
          returning: true, // This ensures that the updated server is returned
        },
      );

      const updatedServerData = updatedServer[1][0];

      await updatedServerData.$remove('members', user);
      return server;
    } catch (error) {
      throw error;
    }
  }
}
