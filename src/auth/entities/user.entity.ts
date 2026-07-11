import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn,
} from 'typeorm';

export enum UserRole {
  USER  = 'USER',
  ADMIN = 'ADMIN',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 200 })
  email: string;

  @Column({ length: 200 })
  passwordHash: string;

  @Column({ length: 100 })
  name: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Column({ length: 20, nullable: true, default: null })
  phone: string | null;

  @Column({ length: 200, nullable: true, default: null })
  address: string | null;

  @Column({ name: 'address_detail', length: 200, nullable: true, default: null })
  addressDetail: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
