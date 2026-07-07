import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SiteConfig } from './entities/site-config.entity';

@Injectable()
export class SiteConfigService {
  constructor(
    @InjectRepository(SiteConfig)
    private readonly repo: Repository<SiteConfig>,
  ) {}

  async get(): Promise<SiteConfig> {
    let config = await this.repo.findOneBy({ id: 1 });
    if (!config) {
      config = this.repo.create({
        id: 1,
        kakaoOpenTalkUrl: null,
        companyName:     'STAY TILE',
        ceoName:         '강승연',
        businessNumber:  '175-22-02643',
        address:         '호현로 85번길 5',
        csPhone:         '010-4636-7911',
        csEmail:         'cs@architing.com',
        csHours:         '월요일 ~ 금요일 10:00 ~ 17:00',
        mailOrderNumber: null,
        bankName:        null,
        bankAccount:     null,
        bankHolder:      null,
        showroomEnabled: true,
        showroomAddress: null,
        showroomMapUrl:  null,
        showroomSubway:  null,
        showroomCar:     null,
        showroomBus:     null,
        showroomHours:   null,
        b2bEnabled:      true,
        b2bTitle:        '사업자 회원 특별 혜택',
        b2bDescription:  '사업자 인증 완료 고객에게는 특별 할인가와 전용 견적 서비스를 제공합니다. 지금 바로 사업자 인증을 신청하세요.',
      });
      await this.repo.save(config);
    }
    return config;
  }

  async update(dto: Partial<Omit<SiteConfig, 'id' | 'updatedAt'>>): Promise<SiteConfig> {
    const config = await this.get();
    Object.assign(config, dto);
    return this.repo.save(config);
  }
}
