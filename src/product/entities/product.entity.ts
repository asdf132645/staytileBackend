import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn,
} from 'typeorm';
import { SubCategory } from '../../category/entities/sub-category.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column({ name: 'sub_category_id', unsigned: true })
  subCategoryId: number;

  @ManyToOne(() => SubCategory, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sub_category_id' })
  subCategory: SubCategory;

  @Column({ length: 200 })
  name: string;

  @Column({ length: 200 })
  slug: string;

  @Column({ length: 100, nullable: true })
  brand: string | null;

  /** null = 전화문의, 값 있음 = 실제 가격 (원) */
  @Column({ type: 'int', unsigned: true, nullable: true, default: null })
  price: number | null;

  /** price가 null일 때 표시할 커스텀 문구 (null이면 기본값 "전화문의") */
  @Column({ name: 'price_note', length: 100, nullable: true, default: null })
  priceNote: string | null;

  /** null = 샘플 판매 안함, 값 있음 = 샘플 가격 (원) */
  @Column({ name: 'sample_price', type: 'int', unsigned: true, nullable: true, default: null })
  samplePrice: number | null;

  @Column({ length: 500, nullable: true })
  thumbnail: string | null;

  @Column({ type: 'json', nullable: true })
  images: string[] | null;

  @Column({ type: 'longtext', nullable: true })
  description: string | null;  // TipTap HTML

  @Column({ length: 80, nullable: true })
  color: string | null;

  @Column({ name: 'color_name', length: 80, nullable: true })
  colorName: string | null;

  @Column({ name: 'is_visible', default: true })
  isVisible: boolean;

  @Column({ name: 'sort_order', default: 0 })
  sortOrder: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
