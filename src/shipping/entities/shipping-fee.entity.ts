import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn } from 'typeorm';

export enum ShippingCategoryType {
  TILE     = 'TILE',
  MATERIAL = 'MATERIAL',
  OUTLET   = 'OUTLET',
}

@Entity('shipping_fees')
export class ShippingFee {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column({ name: 'category_type', type: 'enum', enum: ShippingCategoryType, unique: true })
  categoryType: ShippingCategoryType;

  @Column({ length: 100 })
  label: string;

  @Column({ name: 'base_fee', type: 'int', unsigned: true, default: 0 })
  baseFee: number;

  @Column({ name: 'free_threshold', type: 'int', unsigned: true, nullable: true })
  freeThreshold: number | null;

  @Column({ type: 'text', nullable: true })
  extraInfo: string | null;

  @Column({ name: 'is_enabled', default: true })
  isEnabled: boolean;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
