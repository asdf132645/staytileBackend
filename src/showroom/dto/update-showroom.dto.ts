import { IsOptional, IsString, IsBoolean, IsArray, MaxLength } from 'class-validator';

export class UpdateShowroomDto {
  @IsOptional() @IsString() @MaxLength(200)  title?: string;
  @IsOptional() @IsString() @MaxLength(300)  subtitle?: string;
  @IsOptional() @IsString()                  description?: string | null;
  @IsOptional() @IsString()                  heroImage?: string | null;
  @IsOptional() @IsArray() @IsString({ each: true }) images?: string[] | null;
  @IsOptional() @IsString() @MaxLength(100)  ctaText?: string;
  @IsOptional() @IsString() @MaxLength(500)  ctaUrl?: string;
  @IsOptional() @IsString() @MaxLength(300)  address?: string | null;
  @IsOptional() @IsString() @MaxLength(50)   phone?: string | null;
  @IsOptional() @IsString() @MaxLength(500)  kakaoUrl?: string | null;
  @IsOptional() @IsBoolean()                 isPublished?: boolean;
}
