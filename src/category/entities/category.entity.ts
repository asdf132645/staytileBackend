import {
  Entity, PrimaryGeneratedColumn, Column,
  OneToMany, CreateDateColumn, UpdateDateColumn,
} from 'typeorm';
import { SubCategory } from './sub-category.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column({ length: 80, unique: true })
  slug: string;

  @Column({ length: 120 })
  name: string;

  @Column({ name: 'sort_order', default: 0 })
  sortOrder: number;

  @Column({ name: 'is_visible', default: true })
  isVisible: boolean;

  @OneToMany(() => SubCategory, (sub) => sub.mainCategory, { eager: false })
  subCategories: SubCategory[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
