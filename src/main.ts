import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: true,   // 모든 origin 허용 (카카오톡 인앱브라우저 등 대응)
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
