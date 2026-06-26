import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'https://staytile.com',
      'https://www.staytile.com',
      'https://admin.staytile.com',
      'http://localhost:3000',
      'http://localhost:5173',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true,
  });

  // 전역 유효성 검사 파이프
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,          // DTO에 없는 필드 자동 제거
      forbidNonWhitelisted: true,
      transform: true,          // 타입 자동 변환 (string→number 등)
    }),
  );

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  console.log(`✅  Stay Tile API running on http://localhost:${port}`);
}

bootstrap();
