import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';
import { AppModule } from './app.module';

async function bootstrap() {
  const envConfig = dotenv.config();

  if (envConfig.error) {
    console.error('Failed to load .env file:', envConfig.error.message);
    process.exit(1);
  }

  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:9090',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  const port = process.env.PORT || 4300;
  await app.listen(port);

  console.log(`Application is running on: http://localhost:${port}`);
}

bootstrap();