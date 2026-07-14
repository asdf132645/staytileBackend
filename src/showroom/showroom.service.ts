import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Showroom } from './entities/showroom.entity';
import { UpdateShowroomDto } from './dto/update-showroom.dto';

@Injectable()
export class ShowroomService {
  constructor(
    @InjectRepository(Showroom)
    private readonly repo: Repository<Showroom>,
  ) {}

  /** 항상 id=1 싱글턴 */
  async get(): Promise<Showroom> {
    let record = await this.repo.findOne({ where: { id: 1 } });
    if (!record) {
      record = this.repo.create({ id: 1 });
      await this.repo.save(record);
    }
    return record;
  }

  async update(dto: UpdateShowroomDto): Promise<Showroom> {
    let record = await this.get();
    Object.assign(record, dto);
    return this.repo.save(record);
  }
}
