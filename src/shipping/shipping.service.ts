import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShippingFee, ShippingCategoryType } from './entities/shipping-fee.entity';
import { UpdateShippingDto } from './dto/update-shipping.dto';

@Injectable()
export class ShippingService implements OnModuleInit {
  constructor(
    @InjectRepository(ShippingFee)
    private readonly shippingRepo: Repository<ShippingFee>,
  ) {}

  /** 앱 시작 시 초기 데이터가 없으면 자동 생성 */
  async onModuleInit() {
    const count = await this.shippingRepo.count();
    if (count === 0) {
      await this.shippingRepo.save([
        { categoryType: ShippingCategoryType.TILE,     label: '타일 배송비',      baseFee: 5000, freeThreshold: 200000, extraInfo: '제주/도서산간 추가 배송비 발생' },
        { categoryType: ShippingCategoryType.MATERIAL, label: '부자재 배송비',    baseFee: 3000, freeThreshold: 100000, extraInfo: null },
        { categoryType: ShippingCategoryType.OUTLET,   label: '떨이/아울렛 배송비', baseFee: 0,  freeThreshold: null,   extraInfo: '재고 현황에 따라 픽업 전용일 수 있습니다' },
      ]);
    }
  }

  findAll(): Promise<ShippingFee[]> {
    return this.shippingRepo.find({
      order: { categoryType: 'ASC' },
    });
  }

  async findOne(id: number): Promise<ShippingFee> {
    const fee = await this.shippingRepo.findOneBy({ id });
    if (!fee) throw new NotFoundException(`배송비 #${id}를 찾을 수 없습니다.`);
    return fee;
  }

  async update(id: number, dto: UpdateShippingDto): Promise<ShippingFee> {
    const fee = await this.findOne(id);
    Object.assign(fee, dto);
    return this.shippingRepo.save(fee);
  }

  /** 프론트에서 카테고리 타입으로 배송비 조회 */
  async findByType(type: ShippingCategoryType): Promise<ShippingFee> {
    const fee = await this.shippingRepo.findOneBy({ categoryType: type });
    if (!fee) throw new NotFoundException(`배송비 타입 '${type}'을 찾을 수 없습니다.`);
    return fee;
  }
}
