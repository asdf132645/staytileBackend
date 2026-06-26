import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS: 환경변수에서 쉼표 구분 파싱 (공백 trim 포함)
  const allowedOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim()).filter(Boolean)
    : ['http://localhost:3000', 'http://localhost:5173'];

  app.enableCors({
    origin: (origin, callback) => {
      // 서버 간 요청(origin 없음) 또는 허용 목록에 있는 경우 허용
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked: ${origin}`));
      }
    },
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
