import { Module } from '@nestjs/common';
import { AppController } from 'src/features/app/app.controller';
import { AppService } from './features/app/app.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/features/users/user.model';
import { UsersModule } from 'src/features/users/users.module';
import { AuthModule } from 'src/features/auth/auth.module';
import { MessagesGatewayModule } from 'src/features/messages-websocket/messages.gateway.module';
import { ServersModule } from './features/servers/servers.module';
import { AuthGuard } from './features/auth/auth.guard';
import { ServerUser } from './features/server-user/server-user.model';
import { Server } from './features/servers/server.model';
import * as config from '../config/config.json';

const DbDevConfig = config.development;
@Module({
  imports: [
    SequelizeModule.forRoot({
      ...DbDevConfig,
      dialect: 'postgres',
      models: [User, Server, ServerUser],
      autoLoadModels: true,
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    MessagesGatewayModule,
    ServersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'APP_GUARD',
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
