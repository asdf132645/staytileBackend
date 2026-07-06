import { Controller, Get, Post, Patch, Delete, Param, Body, ParseIntPipe, HttpCode, HttpStatus } from '@nestjs/common'
import { BannerService } from './banner.service'
import { CreateBannerDto } from './dto/create-banner.dto'
import { UpdateBannerDto } from './dto/update-banner.dto'

@Controller('api/banners')
export class BannerController {
  constructor(private readonly service: BannerService) {}

  /** 어드민: 전체 목록 */
  @Get()
  findAll() { return this.service.findAll() }

  /** 프론트: 노출 중인 배너만 */
  @Get('public')
  findPublic() { return this.service.findPublic() }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) { return this.service.findOne(id) }

  @Post()
  create(@Body() dto: CreateBannerDto) { return this.service.create(dto) }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateBannerDto) {
    return this.service.update(id, dto)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) { return this.service.remove(id) }
}
