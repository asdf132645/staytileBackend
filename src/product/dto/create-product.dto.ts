import {
  IsString, IsBoolean, IsInt, IsOptional,
  IsArray, Min, MaxLength, IsUrl,
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
  slug?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  brand?: string | null;

  /** null = 전화문의 */
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  price?: number | null;

  /** null = 샘플 판매 안함 */
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  samplePrice?: number | null;

  @IsOptional()
  @IsString()
  thumbnail?: string | null;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

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
  @IsInt()
  @Min(0)
  @Type(() => Number)
  sortOrder?: number;
}
