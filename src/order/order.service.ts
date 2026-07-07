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

  /** 주문번호 + 연락처로 공개 조회 (비회원도 사용 가능) */
  async findByIdAndPhone(id: number, phone: string): Promise<Order> {
    const order = await this.orderRepo.findOneBy({ id });
    if (!order) throw new NotFoundException(`주문 #${id}를 찾을 수 없습니다.`);
    // 연락처 하이픈 무시하고 비교
    const normalize = (p: string) => p.replace(/-/g, '');
    if (normalize(order.phone) !== normalize(phone)) {
      throw new NotFoundException(`주문 정보가 일치하지 않습니다.`);
    }
    return order;
  }

  async updateStatus(id: number, status: OrderStatus): Promise<Order> {
    const order = await this.findOne(id);
    order.status = status;
    return this.orderRepo.save(order);
  }

  async remove(id: number): Promise<void> {
    const order = await this.findOne(id);
    // SHIPPED 또는 CANCELLED만 삭제 허용
    if (order.status !== 'SHIPPED' && order.status !== 'CANCELLED') {
      throw new Error('발송완료 또는 취소된 주문만 삭제할 수 있습니다.');
    }
    await this.orderRepo.remove(order);
  }
}
