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
import { FriendsModule } from '../friends/friends.module';
import { Friends } from '../friends/models/friend.model';
import { FriendsRequest } from '../friends-request/model/friend-request.model';
import { FriendsRequestModule } from '../friends-request/friends-request.module';
import { DevtoolsModule } from '@nestjs/devtools-integration';
import { ChannelsModule } from '../channels/channel.module';
import { Channels } from '../channels/models/channel.model';
import { ChannelsServers } from '../channels-server/models/channel-server.model';
import { ChannelsGatewayModule } from '../channels-websocket/channels-gateway.module';
import { Dialect } from 'sequelize';
import { CassandraModule } from '@mich4l/nestjs-cassandra';

@Module({
  imports: [
    DevtoolsModule.register({
      http: process.env.NODE_ENV !== 'production',
      port: parseInt(process.env.API_HTTP_DEVTOOLS_PORT),
    }),
    SequelizeModule.forRoot({
      dialect: process.env.DB_DIALECT as Dialect,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      models: [
        User,
        Server,
        ServerUser,
        Friends,
        FriendsRequest,
        Channels,
        ChannelsServers,
      ],
      autoLoadModels: true,
      synchronize: true,
    }),
    CassandraModule.forRoot({
      keyspace: process.env.DB_KEYSPACE,
      contactPoints: [process.env.DB_CONTACT_POINT],
      localDataCenter: 'datacenter1',
    }),
    UsersModule,
    AuthModule,
    MessagesGatewayModule,
    ServersModule,
    FriendsModule,
    FriendsRequestModule,
    ChannelsModule,
    ChannelsGatewayModule,
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
