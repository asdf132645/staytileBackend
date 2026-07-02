import {
  Controller, Post, Get, Body, UseGuards, Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity';

@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Request() req: any) {
    return this.authService.me(req.user);
  }

  /**
   * 최초 어드민 계정 승격 (이미 존재하는 유저를 ADMIN으로)
   * 사용법: POST /api/auth/promote-admin { "secret": "...", "email": "..." }
   * 서버 환경변수 ADMIN_PROMOTE_SECRET 이 설정되어야 함
   */
  @Post('promote-admin')
  async promoteAdmin(@Body() body: { secret: string; email: string }) {
    const expectedSecret = process.env.ADMIN_PROMOTE_SECRET;
    if (!expectedSecret || body.secret !== expectedSecret) {
      return { ok: false, message: '권한 없음' };
    }
    const user = await this.userRepo.findOne({ where: { email: body.email } });
    if (!user) return { ok: false, message: '유저 없음' };
    user.role = UserRole.ADMIN;
    await this.userRepo.save(user);
    return { ok: true, message: `${body.email} → ADMIN 승격 완료` };
  }
}
