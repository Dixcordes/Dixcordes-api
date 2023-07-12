import { Body, Controller, Param, Post, Request } from '@nestjs/common';
import { ServerDto } from './dto/server.dto';
import { ServersService } from './servers.service';
import { Server } from './server.model';

@Controller('servers')
export class ServersController {
  constructor(private serversService: ServersService) {}

  @Post('create')
  createServer(@Body() serverDto: ServerDto, @Request() req): Promise<Server> {
    return this.serversService.createServer(serverDto, req.user.sub);
  }

  @Post('join')
  joinServer(@Param('serverId') serverId, @Request() req): Promise<Server> {
    return this.serversService.joinServer(serverId, req.user.sub);
  }
}
