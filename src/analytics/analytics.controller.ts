import { Controller, Post, Get, Query, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('api/analytics')
export class AnalyticsController {
  constructor(private readonly svc: AnalyticsService) {}

  /** 프론트에서 호출 — public */
  @Post('track')
  async track(@Req() req: Request) {
    const ip =
      (req.headers['cf-connecting-ip'] as string) ||
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      req.ip ||
      '0.0.0.0';
    const path    = (req.body as any)?.path ?? '/';
    const ua      = req.headers['user-agent'] ?? null;
    const referer = (req.headers['referer'] as string) ?? null;

    // 봇 필터링
    if (ua && /bot|crawler|spider|curl|wget|python|java|go-http/i.test(ua)) {
      return { ok: true };
    }

    await this.svc.track(ip, path, ua, referer);
    return { ok: true };
  }

  /** 어드민 전용 */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get('stats')
  async stats(@Query('period') period: 'today' | 'week' | 'month' | 'all' = 'today') {
    return this.svc.getStats(period);
  }
}
