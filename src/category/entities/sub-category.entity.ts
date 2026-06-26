import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn,
} from 'typeorm';
import { Category } from './category.entity';

export enum TemplateType {
  PRODUCT_GRID = 'PRODUCT_GRID',
  BOARD        = 'BOARD',
  PROMO_BANNER = 'PROMO_BANNER',
}

export enum AspectRatio {
  SQUARE    = 'square',
  PORTRAIT  = 'portrait',
  LANDSCAPE = 'landscape',
}

@Entity('sub_categories')
export class SubCategory {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column({ name: 'main_category_id', unsigned: true })
  mainCategoryId: number;

  @ManyToOne(() => Category, (cat) => cat.subCategories, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'main_category_id' })
  mainCategory: Category;

  @Column({ length: 80 })
  slug: string;

  @Column({ length: 120 })
  name: string;

  @Column({ name: 'sort_order', default: 0 })
  sortOrder: number;

  @Column({ name: 'is_visible', default: true })
  isVisible: boolean;

  @Column({ name: 'template_type', type: 'enum', enum: TemplateType, default: TemplateType.PRODUCT_GRID })
  templateType: TemplateType;

  @Column({ name: 'aspect_ratio', type: 'enum', enum: AspectRatio, nullable: true, default: null })
  aspectRatio: AspectRatio | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
