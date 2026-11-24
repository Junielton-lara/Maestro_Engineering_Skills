import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configureApp } from './configure-app';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: ['error', 'warn', 'log'] });
  configureApp(app);
  const port = Number(process.env.PORT ?? 3001);
  await app.listen(port);
  Logger.log(`API ouvindo na porta ${port}`, 'Bootstrap');
}

void bootstrap();
