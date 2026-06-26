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
        synchronize: false,   // 운영에서는 반드시 false — 마이그레이션 사용
        timezone:    '+09:00',
        charset:     'utf8mb4',
        logging:     config.get('NODE_ENV') !== 'production',
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
