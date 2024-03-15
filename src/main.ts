import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });
  app.setGlobalPrefix('api/v1');

  // Use the ValidationPipe to enforce validation rules
  app.useGlobalPipes(new ValidationPipe());

  // Use the IoAdapter to enable WebSockets
  app.useWebSocketAdapter(new IoAdapter(app));

  // Enable CORS if needed
  app.enableCors();

  await app.listen(3000);
}
bootstrap();
