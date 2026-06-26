import { IsString, IsBoolean, IsInt, IsOptional, Min, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCategoryDto {
  @IsString()
  @MaxLength(80)
  slug: string;

  @IsString()
  @MaxLength(120)
  name: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  sortOrder?: number = 0;

  @IsOptional()
  @IsBoolean()
  isVisible?: boolean = true;
}
