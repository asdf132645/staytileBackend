import { Controller, Get, Patch, Param, Body, ParseIntPipe, Query } from '@nestjs/common';
import { ShippingService } from './shipping.service';
import { UpdateShippingDto } from './dto/update-shipping.dto';
import { ShippingCategoryType } from './entities/shipping-fee.entity';

@Controller('api/shipping-fees')
export class ShippingController {
  constructor(private readonly shippingService: ShippingService) {}

  /**
   * GET /api/shipping-fees
   * GET /api/shipping-fees?type=TILE
   */
  @Get()
  findAll(@Query('type') type?: ShippingCategoryType) {
    if (type) return this.shippingService.findByType(type);
    return this.shippingService.findAll();
  }

  /** GET /api/shipping-fees/:id */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.shippingService.findOne(id);
  }

  /** PATCH /api/shipping-fees/:id */
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateShippingDto,
  ) {
    return this.shippingService.update(id, dto);
  }
}
