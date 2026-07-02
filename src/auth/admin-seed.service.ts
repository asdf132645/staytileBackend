import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User, UserRole } from './entities/user.entity';

/**
 * 서버 시작 시 .env의 ADMIN_EMAIL / ADMIN_PASSWORD 로
 * 어드민 계정을 자동 생성/동기화한다.
 *
 * .env 예시:
 *   ADMIN_EMAIL=admin@staytile.com
 *   ADMIN_PASSWORD=Admin1234!
 */
@Injectable()
export class AdminSeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(AdminSeedService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async onApplicationBootstrap() {
    const email    = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
      this.logger.warn('ADMIN_EMAIL / ADMIN_PASSWORD 환경변수가 없어 어드민 시드를 건너뜁니다.');
      return;
    }

    let admin = await this.userRepo.findOne({ where: { email } });

    if (!admin) {
      const passwordHash = await bcrypt.hash(password, 10);
      admin = this.userRepo.create({
        email,
        passwordHash,
        name: '관리자',
        role: UserRole.ADMIN,
      });
      await this.userRepo.save(admin);
      this.logger.log(`✅ 어드민 계정 생성 완료: ${email}`);
    } else {
      // 이미 있으면 비밀번호만 최신화 + role 보장
      admin.passwordHash = await bcrypt.hash(password, 10);
      admin.role         = UserRole.ADMIN;
      await this.userRepo.save(admin);
      this.logger.log(`🔄 어드민 계정 동기화 완료: ${email}`);
    }
  }
}
