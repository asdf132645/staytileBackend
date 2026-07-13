import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn,
} from 'typeorm';

export enum BusinessStatus {
  PENDING  = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

@Entity('business_profiles')
export class BusinessProfile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column({ length: 200 })
  companyName: string;

  @Column({ length: 50 })
  businessNumber: string;

  @Column({ type: 'enum', enum: BusinessStatus, default: BusinessStatus.PENDING })
  status: BusinessStatus;

  @Column({ type: 'text', nullable: true })
  rejectReason: string | null;

  // ── 마케팅 파트너 정보 (파트너가 직접 입력, 스테이타일 팀이 관리) ──
  @Column({ name: 'blog_url', length: 500, nullable: true, default: null })
  blogUrl: string | null;

  @Column({ name: 'sns_url', length: 500, nullable: true, default: null })
  snsUrl: string | null;

  @Column({ name: 'sns_username', length: 200, nullable: true, default: null })
  snsUsername: string | null;

  // 파트너가 스테이타일 팀에게 위임하는 SNS 비밀번호 (관리 대행용)
  @Column({ name: 'sns_password', length: 200, nullable: true, default: null })
  snsPassword: string | null;

  @Column({ name: 'partner_note', type: 'text', nullable: true, default: null })
  partnerNote: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
