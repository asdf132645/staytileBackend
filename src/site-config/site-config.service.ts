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
      config = this.repo.create({ id: 1, kakaoOpenTalkUrl: null });
      await this.repo.save(config);
    }
    return config;
  }

  async update(dto: Partial<Pick<SiteConfig, 'kakaoOpenTalkUrl'>>): Promise<SiteConfig> {
    const config = await this.get();
    Object.assign(config, dto);
    return this.repo.save(config);
  }
}
