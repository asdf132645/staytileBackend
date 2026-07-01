import { Controller, Get, Patch, Body } from '@nestjs/common';
import { IsOptional, IsString, MaxLength } from 'class-validator';
import { SiteConfigService } from './site-config.service';

export class UpdateSiteConfigDto {
  @IsOptional()
  @IsString()
  @MaxLength(500)
  kakaoOpenTalkUrl?: string | null;
}

@Controller('api/site-config')
export class SiteConfigController {
  constructor(private readonly service: SiteConfigService) {}

  @Get()
  get() {
    return this.service.get();
  }

  @Get('public')
  getPublic() {
    return this.service.get();
  }

  @Patch()
  update(@Body() dto: UpdateSiteConfigDto) {
    return this.service.update(dto);
  }
}
