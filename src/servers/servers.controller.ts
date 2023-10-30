import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ServerDto } from './dto/server.dto';
import { ServersService } from './servers.service';
import { Server } from './server.model';
import { User } from 'src/users/user.model';
import { InjectModel } from '@nestjs/sequelize';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { FilesServices } from 'src/utils/files/files-utils.service';

@Controller('servers')
export class ServersController {
  constructor(
    private serversService: ServersService,
    @InjectModel(User)
    private user: typeof User,
  ) {}

  @Get()
  findAll(): Promise<Server[]> {
    return this.serversService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Server> {
    return this.serversService.findOne(id);
  }

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

  @Get('member/:serverId/:userId')
  getOneMember(
    @Param('serverId') serverId,
    @Param('userId') userId,
  ): Promise<User> {
    return this.serversService.getOneMember(serverId, userId);
  }

  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, callback) => {
          const uploadPath = FilesServices.uploadFilesPath('server');
          callback(null, uploadPath);
        },
        filename: (req, file, callback) => {
          const uniqueFileName = FilesServices.generateUniqueFileName(
            file.originalname,
          );
          callback(null, `${uniqueFileName}`);
        },
      }),
    }),
  )
  update(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: number,
    @Body() serverDto: ServerDto,
    @Request() req,
  ): Promise<Server> {
    return this.serversService.updateServer(id, serverDto, file, req.user.sub);
  }
}
