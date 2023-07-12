import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
} from '@nestjs/common';
import { ServerDto } from './dto/server.dto';
import { ServersService } from './servers.service';
import { Server } from './server.model';

@Controller('servers')
export class ServersController {
  constructor(private serversService: ServersService) {}

  @Post()
  createServer(@Body() serverDto: ServerDto, @Request() req): Promise<Server> {
    return this.serversService.createServer(serverDto, req.user.sub);
  }
}
