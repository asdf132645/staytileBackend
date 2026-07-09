import { Controller, Get, Patch, Body } from '@nestjs/common';
import { IsOptional, IsString, MaxLength } from 'class-validator';
import { SiteConfigService } from './site-config.service';

export class UpdateSiteConfigDto {
  @IsOptional() @IsString() @MaxLength(500)
  kakaoOpenTalkUrl?: string | null;

  @IsOptional() @IsString() @MaxLength(100)
  companyName?: string | null;

  @IsOptional() @IsString() @MaxLength(50)
  ceoName?: string | null;

  @IsOptional() @IsString() @MaxLength(30)
  businessNumber?: string | null;

  @IsOptional() @IsString() @MaxLength(200)
  address?: string | null;

  @IsOptional() @IsString() @MaxLength(30)
  csPhone?: string | null;

  @IsOptional() @IsString() @MaxLength(100)
  csEmail?: string | null;

  @IsOptional() @IsString() @MaxLength(100)
  csHours?: string | null;

  @IsOptional() @IsString() @MaxLength(100)
  mailOrderNumber?: string | null;

  @IsOptional() @IsString() @MaxLength(30)
  bankName?: string | null;

  @IsOptional() @IsString() @MaxLength(50)
  bankAccount?: string | null;

  @IsOptional() @IsString() @MaxLength(50)
  bankHolder?: string | null;

  @IsOptional()
  showroomEnabled?: boolean;

  @IsOptional() @IsString() @MaxLength(200)
  showroomAddress?: string | null;

  @IsOptional() @IsString() @MaxLength(500)
  showroomMapUrl?: string | null;

  @IsOptional() @IsString() @MaxLength(200)
  showroomSubway?: string | null;

  @IsOptional() @IsString() @MaxLength(200)
  showroomCar?: string | null;

  @IsOptional() @IsString() @MaxLength(200)
  showroomBus?: string | null;

  @IsOptional() @IsString() @MaxLength(100)
  showroomHours?: string | null;

  @IsOptional()
  b2bEnabled?: boolean;

  @IsOptional() @IsString() @MaxLength(100)
  b2bTitle?: string | null;

  @IsOptional() @IsString() @MaxLength(300)
  b2bDescription?: string | null;

  @IsOptional() @IsString() @MaxLength(500)
  snsInstagram?: string | null;

  @IsOptional() @IsString() @MaxLength(500)
  snsNaverBlog?: string | null;

  @IsOptional() @IsString() @MaxLength(500)
  snsThreads?: string | null;

  @IsOptional() @IsString() @MaxLength(500)
  snsYoutube?: string | null;

  @IsOptional() @IsString() @MaxLength(500)
  snsNaverPost?: string | null;
}

@Controller('api/site-config')
export class SiteConfigController {
  constructor(private readonly service: SiteConfigService) {}

  @Get()
  get() { return this.service.get(); }

  @Get('public')
  getPublic() { return this.service.get(); }

  @Patch()
  update(@Body() dto: UpdateSiteConfigDto) { return this.service.update(dto); }
}
