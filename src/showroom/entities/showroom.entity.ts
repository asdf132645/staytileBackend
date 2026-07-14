import {
  Entity, PrimaryGeneratedColumn, Column,
  UpdateDateColumn,
} from 'typeorm';

@Entity('showroom')
export class Showroom {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200, default: '' })
  title: string;

  @Column({ length: 300, default: '' })
  subtitle: string;

  @Column({ type: 'text', nullable: true, default: null })
  description: string | null;

  @Column({ name: 'hero_image', type: 'text', nullable: true, default: null })
  heroImage: string | null;

  @Column({ type: 'json', nullable: true, default: null })
  images: string[] | null;

  @Column({ name: 'cta_text', length: 100, default: '제품 둘러보기' })
  ctaText: string;

  @Column({ name: 'cta_url', length: 500, default: '/' })
  ctaUrl: string;

  @Column({ length: 300, nullable: true, default: null })
  address: string | null;

  @Column({ length: 50, nullable: true, default: null })
  phone: string | null;

  @Column({ name: 'kakao_url', length: 500, nullable: true, default: null })
  kakaoUrl: string | null;

  @Column({ name: 'is_published', default: true })
  isPublished: boolean;

  @UpdateDateColumn()
  updatedAt: Date;
}
