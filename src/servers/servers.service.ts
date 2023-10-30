import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Server } from './server.model';
import { ServerDto } from './dto/server.dto';
import { User } from 'src/users/user.model';
import { ServerUser } from 'src/server-user/server-user.model';
import { UsersService } from '../users/users.service';
import * as fs from 'fs';
import { stringify } from 'querystring';

@Injectable()
export class ServersService {
  constructor(
    @InjectModel(Server)
    private serverModel: typeof Server,
    @InjectModel(User)
    private userModel: typeof User,
    @InjectModel(ServerUser)
    private serverUserModel: typeof ServerUser,
    private usersService: UsersService,
  ) {}

  async findAll(): Promise<Server[]> {
    return this.serverModel.findAll();
  }

  async findOne(id: number): Promise<Server> {
    return await this.serverModel.findOne({ where: { id } });
  }

  async createServer(serverDto: ServerDto, req: string): Promise<Server> {
    const defaultPhoto = '/files/servers/default/default_photo.png';
    try {
      if (serverDto.name === undefined || serverDto.name === '') {
        throw new HttpException('name is required', HttpStatus.BAD_REQUEST);
      }
      const serverCreator = req;
      const server = await this.serverModel.create({
        name: serverDto.name,
        photo: defaultPhoto,
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

  async updateServer(
    id: number,
    serverDto: ServerDto,
    file: Express.Multer.File,
    tokenUserAdminId: number,
  ): Promise<Server> {
    const server = await this.findOne(id);
    const adminId = server.admin;
    const user = await this.usersService.findOne(Number(adminId));
    if (!server) {
      throw new HttpException('server not found', HttpStatus.NOT_FOUND);
    } else if (id === undefined || id === null) {
      throw new HttpException('id is required', HttpStatus.BAD_REQUEST);
    }
    if (!user) {
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    } else if (user.id !== tokenUserAdminId) {
      throw new HttpException(
        'you need the right to update this server.',
        HttpStatus.UNAUTHORIZED,
      );
    }
    if (
      serverDto.name == undefined ||
      serverDto.name == '' ||
      serverDto.name == null
    ) {
      serverDto.name = server.name;
    }
    if (file !== undefined && file !== null) {
      serverDto.photo = file.path;
      if (server.photo !== '/files/servers/default/default_photo.png') {
        fs.unlinkSync(server.photo);
      }
    } else if (file === undefined || file === null)
      serverDto.photo = server.photo;
    await server.update({
      name: serverDto.name,
      photo: serverDto.photo,
      isPublic: serverDto.isPublic,
      isActive: serverDto.isActive,
    });
    return {
      id: server.id,
      name: server.name,
      photo: server.photo,
      isPublic: server.isPublic,
      isActive: server.isActive,
    } as Server;
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

  async getServer(serverId: number): Promise<Server> {
    try {
      const server = await this.serverModel.findOne({
        where: { id: serverId },
      });
      if (!server) {
        throw new HttpException('server not found', HttpStatus.NOT_FOUND);
      }
      return server;
    } catch (error) {
      throw error;
    }
  }

  async getAllMembers(serverId: number): Promise<User[]> {
    try {
      const server = await this.serverModel.findOne({
        where: { id: serverId },
      });
      if (!server) {
        throw new HttpException('server not found', HttpStatus.NOT_FOUND);
      }
      const members = await server.$get('members');
      return members;
    } catch (error) {
      throw error;
    }
  }

  async getOneMember(serverId: number, userId: number): Promise<User> {
    try {
      const server = await this.serverModel.findOne({
        where: { id: serverId },
        include: [this.userModel],
      });
      const user = await this.userModel.findOne({
        where: { id: userId },
      });
      if (!server) {
        throw new HttpException('server not found', HttpStatus.NOT_FOUND);
      } else if (!user) {
        throw new HttpException('user not found', HttpStatus.NOT_FOUND);
      }
      const member = await this.serverUserModel.findOne({
        where: { serverId: serverId, userId: userId },
      });
      if (!member) {
        throw new HttpException(
          'User not found in the server',
          HttpStatus.NOT_FOUND,
        );
      }

      // Utiliser user property pour obtenir l'utilisateur associé au membre
      return user;
    } catch (error) {
      throw error;
    }
  }
}
