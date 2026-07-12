import {
  IsString, IsBoolean, IsInt, IsOptional,
  IsArray, Min, MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsInt()
  @Type(() => Number)
  subCategoryId: number;

  @IsString()
  @MaxLength(200)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  internalName?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  slug?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  brand?: string | null;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  price?: number | null;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  priceNote?: string | null;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  samplePrice?: number | null;

  @IsOptional()
  @IsString()
  thumbnail?: string | null;

  /** 대표 이미지 alt 텍스트 (SEO) */
  @IsOptional()
  @IsString()
  @MaxLength(300)
  thumbnailAlt?: string | null;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  /** 추가 이미지 alt 텍스트 배열 (images 와 인덱스 1:1 대응) */
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  imageAlts?: string[];

  @IsOptional()
  @IsString()
  description?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  color?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  colorName?: string | null;

  @IsOptional()
  @IsBoolean()
  isVisible?: boolean;

  @IsOptional()
  @IsBoolean()
  showCalculator?: boolean;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  sortOrder?: number;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  templateType?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  origin?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  spec?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  material?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  salesUnit?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  sampleNote?: string | null;

  @IsOptional()
  @IsArray()
  certMarks?: Array<{ image: string; label: string }> | null;
}
