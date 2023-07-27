import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');

  app.useWebSocketAdapter(new IoAdapter(app));

  // Activer CORS si nécessaire
  app.enableCors();

  await app.listen(3000);
}
bootstrap();
