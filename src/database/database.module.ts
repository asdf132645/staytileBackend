import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host:     config.get('DB_HOST',     'localhost'),
        port:     config.get<number>('DB_PORT', 3306),
        username: config.get('DB_USERNAME', 'root'),
        password: config.get('DB_PASSWORD', ''),
        database: config.get('DB_DATABASE', 'blue_tile'),
        entities:    [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: true,    // 테이블 자동 생성 (초기 세팅용)
        timezone:    '+09:00',
        charset:     'utf8mb4',
        logging:     config.get('NODE_ENV') !== 'production',
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
