import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Server } from './server.model';
import { ServerDto } from './dto/server.dto';

@Injectable()
export class ServersService {
  constructor(
    @InjectModel(Server)
    private serverModel: typeof Server,
  ) {}

  async createServer(serverDto: ServerDto, req: string): Promise<Server> {
    try {
      if (serverDto.name === undefined || serverDto.name === '') {
        throw new HttpException('name is required', HttpStatus.BAD_REQUEST);
      } else if (serverDto.photo === undefined || serverDto.photo === '') {
        serverDto.photo = '';
      }
      const serverCreator = req;
      return await this.serverModel.create({
        name: serverDto.name,
        photo: serverDto.photo,
        admin: serverCreator,
        isPublic: serverDto.isPublic,
        isActive: serverDto.isActive,
        totalMembers: serverDto.totalMembers,
        members: serverDto.members,
      });
    } catch (error) {
      throw error;
    }
  }
}
