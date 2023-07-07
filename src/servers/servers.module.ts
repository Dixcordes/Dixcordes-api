import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Server } from './server.model';
import { ServersController } from './servers.controller';
import { ServersService } from './servers.service';

@Module({
  imports: [SequelizeModule.forFeature([Server])],
  providers: [ServersService],
  controllers: [ServersController],
  exports: [SequelizeModule],
})
export class ServersModule {}
