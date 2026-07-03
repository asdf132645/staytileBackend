import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
  ) {}

  async create(dto: CreateOrderDto): Promise<Order> {
    const totalAmount = dto.items.reduce(
      (sum, item) => sum + item.samplePrice * item.quantity,
      0,
    );
    const order = this.orderRepo.create({
      userId:       dto.userId ?? null,
      customerName: dto.customerName,
      phone:        dto.phone,
      email:        dto.email ?? null,
      address:      dto.address,
      addressDetail: dto.addressDetail ?? null,
      memo:         dto.memo ?? null,
      items:        dto.items.map(i => ({
        productId:   i.productId,
        productName: i.productName,
        thumbnail:   i.thumbnail ?? null,
        quantity:    i.quantity,
        samplePrice: i.samplePrice,
      })),
      totalAmount,
    });
    return this.orderRepo.save(order);
  }

  findAll(status?: OrderStatus): Promise<Order[]> {
    const where = status ? { status } : {};
    return this.orderRepo.find({
      where,
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.orderRepo.findOneBy({ id });
    if (!order) throw new NotFoundException(`주문 #${id}를 찾을 수 없습니다.`);
    return order;
  }

  findByUserId(userId: number): Promise<Order[]> {
    return this.orderRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async updateStatus(id: number, status: OrderStatus): Promise<Order> {
    const order = await this.findOne(id);
    order.status = status;
    return this.orderRepo.save(order);
  }
}
