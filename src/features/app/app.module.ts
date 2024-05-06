import { Module } from '@nestjs/common';
import { AppController } from 'src/features/app/app.controller';
import { AppService } from './app.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/features/users/user.model';
import { UsersModule } from 'src/features/users/users.module';
import { AuthModule } from 'src/features/auth/auth.module';
import { MessagesGatewayModule } from 'src/features/messages-websocket/messages.gateway.module';
import { ServersModule } from '../servers/servers.module';
import { AuthGuard } from '../auth/auth.guard';
import { ServerUser } from '../server-user/server-user.model';
import { Server } from '../servers/server.model';
import * as config from '../../../config/config.json';
import { FriendsModule } from '../friends/friends.module';
import { Friends } from '../friends/models/friend.model';
import { FriendsRequest } from '../friends/models/friend-request.model';

const DbDevConfig = config.development;
@Module({
  imports: [
    SequelizeModule.forRoot({
      ...DbDevConfig,
      dialect: 'postgres',
      models: [User, Server, ServerUser, Friends, FriendsRequest],
      autoLoadModels: true,
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    MessagesGatewayModule,
    ServersModule,
    FriendsModule,
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
