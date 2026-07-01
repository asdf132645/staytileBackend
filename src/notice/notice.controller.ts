import { Controller, Get, Post, Patch, Delete, Param, Body, ParseIntPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { NoticeService, CreateNoticeDto, UpdateNoticeDto } from './notice.service';

@Controller('api/notices')
export class NoticeController {
  constructor(private readonly service: NoticeService) {}

  @Get()
  findAll() { return this.service.findAll(); }

  @Get('public')
  findPublic() { return this.service.findPublic(); }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) { return this.service.findOne(id); }

  @Post()
  create(@Body() dto: CreateNoticeDto) { return this.service.create(dto); }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateNoticeDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) { return this.service.remove(id); }
}
