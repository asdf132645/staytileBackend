import { IsString, IsBoolean, IsInt, IsOptional, IsEnum, Min, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';
import { TemplateType, AspectRatio } from '../entities/sub-category.entity';

export class CreateSubCategoryDto {
  @IsInt()
  @Type(() => Number)
  mainCategoryId: number;

  @IsString()
  @MaxLength(80)
  slug: string;

  @IsString()
  @MaxLength(120)
  name: string;

  @IsOptional()
  @IsEnum(TemplateType)
  templateType?: TemplateType = TemplateType.PRODUCT_GRID;

  @IsOptional()
  @IsEnum(AspectRatio)
  aspectRatio?: AspectRatio | null = null;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  sortOrder?: number = 0;

  @IsOptional()
  @IsBoolean()
  isVisible?: boolean = true;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  thumbnailUrl?: string | null = null;
}
