import { Body, Controller, Get, Param, Post, Request } from '@nestjs/common';
import { ServerDto } from './dto/server.dto';
import { ServersService } from './servers.service';
import { Server } from './server.model';
import { User } from 'src/users/user.model';
import { InjectModel } from '@nestjs/sequelize';

@Controller('servers')
export class ServersController {
  constructor(
    private serversService: ServersService,
    @InjectModel(User)
    private user: typeof User,
  ) {}

  @Post('create')
  createServer(@Body() serverDto: ServerDto, @Request() req): Promise<Server> {
    return this.serversService.createServer(serverDto, req.user.sub);
  }

  @Post('join/:serverId')
  joinServer(@Param('serverId') serverId, @Request() req): Promise<Server> {
    return this.serversService.joinServer(serverId, req.user.sub);
  }

  @Post('leave/:serverId')
  leaveServer(@Param('serverId') serverId, @Request() req): Promise<Server> {
    return this.serversService.leaveServer(serverId, req.user.sub);
  }

  @Get('/:serverId')
  getServer(@Param('serverId') serverId): Promise<Server> {
    return this.serversService.getServer(serverId);
  }

  @Get('members/:serverId')
  getAllMembers(@Param('serverId') serverId): Promise<User[]> {
    return this.serversService.getAllMembers(serverId);
  }
}
