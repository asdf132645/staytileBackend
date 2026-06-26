import { IsString, IsOptional, IsBoolean, IsInt, IsUrl, IsDateString, Min } from 'class-validator'
import { Transform } from 'class-transformer'

export class CreateBannerDto {
  @IsString()
  imageUrl: string

  @IsOptional()
  @IsString()
  title?: string

  @IsOptional()
  @IsString()
  subtitle?: string

  @IsOptional()
  @IsString()
  linkUrl?: string

  @IsOptional()
  @IsString()
  buttonText?: string

  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number

  @IsOptional()
  @IsBoolean()
  isVisible?: boolean

  @IsOptional()
  @IsDateString()
  startAt?: string

  @IsOptional()
  @IsDateString()
  endAt?: string
}
