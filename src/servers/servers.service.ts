import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Server } from './server.model';
import { ServerDto } from './dto/server.dto';

@Injectable()
export class ServerService {
  constructor(
    @InjectModel(Server)
    private serverModel: typeof Server,
  ) {}

  async createServer(serverDto: ServerDto): Promise<Server> {
    try {
    } catch (error) {
      throw error;
    }
  }
}
