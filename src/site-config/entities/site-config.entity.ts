import { Entity, PrimaryColumn, Column, UpdateDateColumn } from 'typeorm';

@Entity('site_config')
export class SiteConfig {
  @PrimaryColumn({ default: 1 })
  id: number;

  @Column({ name: 'kakao_open_talk_url', type: 'varchar', length: 500, nullable: true, default: null })
  kakaoOpenTalkUrl: string | null;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
