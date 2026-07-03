import {
  Controller, Get, Post, Patch,
  Param, Body, Query, Request,
  ParseIntPipe, UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus } from './entities/order.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  /** POST /api/orders — 주문 생성 (공개) */
  @Post()
  create(@Body() dto: CreateOrderDto) {
    return this.orderService.create(dto);
  }

  /** GET /api/orders/my — 내 주문 목록 (로그인 필요) */
  @Get('my')
  @UseGuards(JwtAuthGuard)
  findMy(@Request() req: any) {
    return this.orderService.findByUserId(req.user.sub);
  }

  /** GET /api/orders/lookup?id=1&phone=010-xxxx-xxxx — 주문번호+연락처 공개 조회 */
  @Get('lookup')
  lookup(
    @Query('id', ParseIntPipe) id: number,
    @Query('phone') phone: string,
  ) {
    return this.orderService.findByIdAndPhone(id, phone);
  }

  /** GET /api/orders?status=PENDING — 전체 주문 목록 (어드민) */
  @Get()
  findAll(@Query('status') status?: OrderStatus) {
    return this.orderService.findAll(status);
  }

  /** GET /api/orders/:id */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.findOne(id);
  }

  /** PATCH /api/orders/:id/status */
  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: OrderStatus,
  ) {
    return this.orderService.updateStatus(id, status);
  }
}
