import { IsString, IsBoolean, IsInt, IsOptional, Min, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateShippingDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  label?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  baseFee?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  freeThreshold?: number | null;

  @IsOptional()
  @IsString()
  extraInfo?: string | null;

  @IsOptional()
  @IsBoolean()
  isEnabled?: boolean;
}
