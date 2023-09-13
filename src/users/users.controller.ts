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
import { UserDto } from 'src/users/dto/user.dto';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/user.model';
import { Public } from 'src/core/decorator/public.decorator';
import { FileExtensionValidationPipe } from 'src/core/pipes/files-extension.pipe';
import LocalFilesInterceptor from 'src/core/interceptor/localFiles.interceptor';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Public()
  @Post()
  create(@Body() userDto: UserDto): Promise<User> {
    return this.usersService.create(userDto);
  }

  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Get(':email')
  findOneByEmail(@Param('email') email: string): Promise<User> {
    return this.usersService.findOneByEmail(email);
  }

  @Patch(':id')
  @UseInterceptors(
    LocalFilesInterceptor({
      fieldName: Math.random().toString(26).slice(2),
      path: 'users',
    }),
  )
  update(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: number,
    @Body() userDto: UserDto,
    @Request() req,
  ): Promise<User> {
    return this.usersService.update(id, userDto, file, req.user.sub);
  }
}
