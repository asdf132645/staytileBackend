import { Controller, Get, Patch, Body } from '@nestjs/common';
import { ShowroomService } from './showroom.service';
import { UpdateShowroomDto } from './dto/update-showroom.dto';

@Controller('api/showroom')
export class ShowroomController {
  constructor(private readonly service: ShowroomService) {}

  /** 공개 — 프론트에서 조회 */
  @Get()
  get() {
    return this.service.get();
  }

  /** 어드민 — 내용 수정 (별도 인증 없이 admin 페이지에서만 호출) */
  @Patch()
  update(@Body() dto: UpdateShowroomDto) {
    return this.service.update(dto);
  }
}
