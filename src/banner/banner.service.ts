import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Banner } from './entities/banner.entity'
import { CreateBannerDto } from './dto/create-banner.dto'
import { UpdateBannerDto } from './dto/update-banner.dto'

@Injectable()
export class BannerService {
  constructor(@InjectRepository(Banner) private repo: Repository<Banner>) {}

  findAll(): Promise<Banner[]> {
    return this.repo.find({ order: { sortOrder: 'ASC', createdAt: 'DESC' } })
  }

  /** 프론트용: isVisible=true 이고 날짜 범위 안인 것만 */
  findPublic(): Promise<Banner[]> {
    const now = new Date()
    return this.repo
      .createQueryBuilder('b')
      .where('b.isVisible = :v', { v: true })
      .andWhere('(b.startAt IS NULL OR b.startAt <= :now)', { now })
      .andWhere('(b.endAt IS NULL OR b.endAt >= :now)', { now })
      .orderBy('b.sortOrder', 'ASC')
      .getMany()
  }

  async findOne(id: number): Promise<Banner> {
    const b = await this.repo.findOneBy({ id })
    if (!b) throw new NotFoundException(`Banner ${id} not found`)
    return b
  }

  create(dto: CreateBannerDto): Promise<Banner> {
    const b = this.repo.create(dto)
    return this.repo.save(b)
  }

  async update(id: number, dto: UpdateBannerDto): Promise<Banner> {
    await this.findOne(id)
    await this.repo.update(id, dto as any)
    return this.findOne(id)
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id)
    await this.repo.delete(id)
  }
}
