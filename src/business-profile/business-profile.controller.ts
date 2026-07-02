import {
  Controller, Get, Post, Patch, Body, Param, ParseIntPipe,
  UseGuards, Request, Query,
} from '@nestjs/common';
import { BusinessProfileService } from './business-profile.service';
import { ApplyBusinessDto } from './dto/apply-business.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BusinessStatus } from './entities/business-profile.entity';

@Controller('api/business-profile')
export class BusinessProfileController {
  constructor(private readonly service: BusinessProfileService) {}

  /** 내 신청 상태 조회 (로그인 필요) */
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMyProfile(@Request() req: any) {
    return this.service.getMyProfile(req.user.id);
  }

  /** 사업자 신청 (로그인 필요) */
  @UseGuards(JwtAuthGuard)
  @Post('apply')
  apply(@Request() req: any, @Body() dto: ApplyBusinessDto) {
    return this.service.apply(req.user.id, dto);
  }

  /** 관리자: 전체 목록 */
  @Get('admin/list')
  findAll(@Query('status') status?: BusinessStatus) {
    return this.service.findAll(status);
  }

  /** 관리자: 승인 */
  @Patch('admin/:id/approve')
  approve(@Param('id', ParseIntPipe) id: number) {
    return this.service.approve(id);
  }

  /** 관리자: 거절 */
  @Patch('admin/:id/reject')
  reject(
    @Param('id', ParseIntPipe) id: number,
    @Body('reason') reason?: string,
  ) {
    return this.service.reject(id, reason);
  }
}
