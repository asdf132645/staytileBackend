import {
  Injectable, ConflictException, NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessProfile, BusinessStatus } from './entities/business-profile.entity';
import { ApplyBusinessDto } from './dto/apply-business.dto';

@Injectable()
export class BusinessProfileService {
  constructor(
    @InjectRepository(BusinessProfile)
    private readonly repo: Repository<BusinessProfile>,
  ) {}

  /** 사용자가 신청 */
  async apply(userId: number, dto: ApplyBusinessDto) {
    const existing = await this.repo.findOne({ where: { userId } });
    if (existing) {
      if (existing.status === BusinessStatus.APPROVED) {
        throw new ConflictException('이미 승인된 사업자 계정입니다.');
      }
      // 재신청: 기존 레코드 업데이트
      existing.companyName    = dto.companyName;
      existing.businessNumber = dto.businessNumber;
      existing.status         = BusinessStatus.PENDING;
      existing.rejectReason   = null;
      return this.repo.save(existing);
    }
    const profile = this.repo.create({ userId, ...dto });
    return this.repo.save(profile);
  }

  /** 내 신청 상태 조회 */
  async getMyProfile(userId: number) {
    return this.repo.findOne({ where: { userId } }) ?? null;
  }

  /** 관리자: 전체 목록 */
  async findAll(status?: BusinessStatus) {
    const where = status ? { status } : {};
    return this.repo.find({ where, order: { createdAt: 'DESC' } });
  }

  /** 관리자: 승인 */
  async approve(id: number) {
    const profile = await this.repo.findOne({ where: { id } });
    if (!profile) throw new NotFoundException();
    profile.status       = BusinessStatus.APPROVED;
    profile.rejectReason = null;
    return this.repo.save(profile);
  }

  /** 관리자: 거절 */
  async reject(id: number, reason?: string) {
    const profile = await this.repo.findOne({ where: { id } });
    if (!profile) throw new NotFoundException();
    profile.status       = BusinessStatus.REJECTED;
    profile.rejectReason = reason ?? null;
    return this.repo.save(profile);
  }
}
