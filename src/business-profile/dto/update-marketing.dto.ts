import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateMarketingDto {
  @IsOptional()
  @IsString()
  @MaxLength(500)
  blogUrl?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  snsUrl?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  snsUsername?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  snsPassword?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  partnerNote?: string | null;
}
