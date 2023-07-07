import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ServerDto } from './dto/server.dto';
import { ServersService } from './servers.service';
import { Server } from './server.model';

@Controller('servers')
export class ServersController {
  constructor(private serversService: ServersService) {}

  @Post()
  createServer(@Body() serverDto: ServerDto): Promise<Server> {
    return this.serversService.createServer(serverDto);
  }
}
