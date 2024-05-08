import { NestFactory } from '@nestjs/core';
import { AppModule } from './features/app/app.module';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
    snapshot: true,
  });
  app.setGlobalPrefix(`api/${process.env.API_VERSION}`);

  // Use the ValidationPipe to enforce validation rules
  app.useGlobalPipes(new ValidationPipe());

  // Use the IoAdapter to enable WebSockets
  app.useWebSocketAdapter(new IoAdapter(app));

  // Enable CORS if needed
  app.enableCors();

  await app.listen(process.env.API_PORT);
}
bootstrap();
