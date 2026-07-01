import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notice } from './entities/notice.entity';
import { IsString, IsBoolean, IsInt, IsOptional, MaxLength, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateNoticeDto {
  @IsString() @MaxLength(200) title: string;
  @IsString() content: string;
  @IsOptional() @IsBoolean() isPinned?: boolean;
  @IsOptional() @IsBoolean() isVisible?: boolean;
  @IsOptional() @IsInt() @Min(0) @Type(() => Number) sortOrder?: number;
}

export class UpdateNoticeDto {
  @IsOptional() @IsString() @MaxLength(200) title?: string;
  @IsOptional() @IsString() content?: string;
  @IsOptional() @IsBoolean() isPinned?: boolean;
  @IsOptional() @IsBoolean() isVisible?: boolean;
  @IsOptional() @IsInt() @Min(0) @Type(() => Number) sortOrder?: number;
}

@Injectable()
export class NoticeService {
  constructor(
    @InjectRepository(Notice)
    private readonly repo: Repository<Notice>,
  ) {}

  findAll(): Promise<Notice[]> {
    return this.repo.find({ order: { isPinned: 'DESC', sortOrder: 'ASC', createdAt: 'DESC' } });
  }

  /** 프론트용: 노출 중인 것만 */
  findPublic(): Promise<Notice[]> {
    return this.repo.find({
      where: { isVisible: true },
      order: { isPinned: 'DESC', sortOrder: 'ASC', createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Notice> {
    const notice = await this.repo.findOneBy({ id });
    if (!notice) throw new NotFoundException(`공지사항 #${id}를 찾을 수 없습니다.`);
    return notice;
  }

  async create(dto: CreateNoticeDto): Promise<Notice> {
    const notice = this.repo.create(dto);
    return this.repo.save(notice);
  }

  async update(id: number, dto: UpdateNoticeDto): Promise<Notice> {
    const notice = await this.findOne(id);
    Object.assign(notice, dto);
    return this.repo.save(notice);
  }

  async remove(id: number): Promise<void> {
    const notice = await this.findOne(id);
    await this.repo.remove(notice);
  }
}
