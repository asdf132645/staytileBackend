import { IsString, IsOptional, IsInt, IsArray, Min, MaxLength, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class OrderItemDto {
  @IsInt()
  productId: number;

  @IsString()
  productName: string;

  @IsOptional()
  @IsString()
  thumbnail?: string | null;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsInt()
  @Min(0)
  samplePrice: number;
}

export class CreateOrderDto {
  @IsOptional()
  @IsInt()
  userId?: number | null;

  @IsString()
  @MaxLength(100)
  customerName: string;

  @IsString()
  @MaxLength(50)
  phone: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  email?: string | null;

  @IsString()
  @MaxLength(300)
  address: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  addressDetail?: string | null;

  @IsOptional()
  @IsString()
  memo?: string | null;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}
