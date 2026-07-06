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
        companyName:    'STAY TILE',
        ceoName:        '강승연',
        businessNumber: '175-22-02643',
        address:        '호현로 85번길 5',
        csPhone:        '010-4636-7911',
        csEmail:        'cs@architing.com',
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
