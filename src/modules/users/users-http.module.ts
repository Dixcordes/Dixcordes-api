import { Module } from '@nestjs/common';
import { UsersModule } from './users.module';
import { UsersService } from 'src/services/users/users.service';
import { UsersController } from 'src/controllers/users/users.controller';

@Module({
  imports: [UsersModule],
  providers: [UsersService],
  controllers: [UsersController]
})
export class UserHttpModule {}
