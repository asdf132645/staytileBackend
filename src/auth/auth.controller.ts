import {
  Controller, Post, Get, Patch, Body, Param, UseGuards, Request,
  ForbiddenException, ParseIntPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity';
import { BusinessProfile } from '../business-profile/entities/business-profile.entity';

@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(BusinessProfile)
    private readonly bizRepo: Repository<BusinessProfile>,
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

  /** 어드민 전용 — 유저 목록 (사업자 상태 포함) */
  @UseGuards(JwtAuthGuard)
  @Get('admin/users')
  async adminUserList(@Request() req: any) {
    if (req.user.role !== UserRole.ADMIN) throw new ForbiddenException();
    const users = await this.userRepo.find({ order: { createdAt: 'DESC' } });
    const bizProfiles = await this.bizRepo.find();
    const bizMap = new Map(bizProfiles.map(b => [b.userId, b]));
    return users.map(u => {
      const biz = bizMap.get(u.id);
      return {
        id:             u.id,
        email:          u.email,
        name:           u.name,
        role:           u.role,
        createdAt:      u.createdAt,
        businessStatus: biz?.status ?? null,
        companyName:    biz?.companyName ?? null,
        businessNumber: biz?.businessNumber ?? null,
      };
    });
  }

  /** 어드민 전용 — 유저 역할 변경 */
  @UseGuards(JwtAuthGuard)
  @Patch('admin/users/:id/role')
  async adminSetRole(
    @Request() req: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { role: UserRole },
  ) {
    if (req.user.role !== UserRole.ADMIN) throw new ForbiddenException();
    const user = await this.userRepo.findOneBy({ id });
    if (!user) return { ok: false };
    user.role = body.role;
    await this.userRepo.save(user);
    return { ok: true };
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
