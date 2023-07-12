import { Module } from '@nestjs/common';
import { AppController } from 'src/app/app.controller';
import { AppService } from './app/app.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/users/user.model';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';
import { GatewayModule } from 'src/websocket/gateway.module';
import { ServersModule } from './servers/servers.module';
import { AuthGuard } from './auth/auth.guard';
import { ServerUser } from './server-user/server-user.model';
import { Server } from './servers/server.model';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'cordes',
      models: [User, Server, ServerUser],
      autoLoadModels: true,
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    GatewayModule,
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
