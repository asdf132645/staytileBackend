import { Entity, PrimaryColumn, Column, UpdateDateColumn } from 'typeorm';

@Entity('site_config')
export class SiteConfig {
  @PrimaryColumn({ default: 1 })
  id: number;

  @Column({ name: 'kakao_open_talk_url', type: 'varchar', length: 500, nullable: true, default: null })
  kakaoOpenTalkUrl: string | null;

  // ── 회사 정보 (푸터) ──────────────────────────────────────
  @Column({ name: 'company_name', length: 100, nullable: true, default: 'STAY TILE' })
  companyName: string | null;

  @Column({ name: 'ceo_name', length: 50, nullable: true, default: '강승연' })
  ceoName: string | null;

  @Column({ name: 'business_number', length: 30, nullable: true, default: '175-22-02643' })
  businessNumber: string | null;

  @Column({ name: 'address', length: 200, nullable: true, default: '호현로 85번길 5' })
  address: string | null;

  @Column({ name: 'cs_phone', length: 30, nullable: true, default: '010-4636-7911' })
  csPhone: string | null;

  @Column({ name: 'cs_email', length: 100, nullable: true, default: 'cs@architing.com' })
  csEmail: string | null;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
