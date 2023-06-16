import { Module } from '@nestjs/common';
import { AppController } from 'src/controllers/app.controller';
import { AppService } from '../services/app.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/users/user.model';
import { UsersModule } from 'src/users/users.module';
// import { UsersController } from 'src/controllers/users/users.controller';
// import { UsersService } from 'src/services/users/users.service';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'cordes',
      models: [User],
      autoLoadModels: true,
      synchronize: true,
    }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
