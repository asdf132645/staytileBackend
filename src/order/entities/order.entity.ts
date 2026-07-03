import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn,
} from 'typeorm';

export enum OrderStatus {
  PENDING   = 'PENDING',    // 주문 접수 (입금 대기)
  CONFIRMED = 'CONFIRMED',  // 입금 확인
  SHIPPED   = 'SHIPPED',    // 발송 완료
  CANCELLED = 'CANCELLED',  // 취소
}

export interface OrderItem {
  productId:   number;
  productName: string;
  thumbnail:   string | null;
  quantity:    number;
  samplePrice: number;
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  // 회원 연결 (nullable — 비회원 주문 허용)
  @Column({ name: 'user_id', type: 'int', unsigned: true, nullable: true, default: null })
  userId: number | null;

  // 주문자 정보
  @Column({ name: 'customer_name', length: 100 })
  customerName: string;

  @Column({ length: 50 })
  phone: string;

  @Column({ length: 200, nullable: true })
  email: string | null;

  @Column({ length: 300 })
  address: string;

  @Column({ name: 'address_detail', length: 200, nullable: true })
  addressDetail: string | null;

  @Column({ type: 'text', nullable: true })
  memo: string | null;

  // 주문 상품 (JSON)
  @Column({ type: 'json' })
  items: OrderItem[];

  // 금액
  @Column({ name: 'total_amount', type: 'int', unsigned: true, default: 0 })
  totalAmount: number;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
