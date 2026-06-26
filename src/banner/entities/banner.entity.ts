import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'

@Entity('banners')
export class Banner {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 500 })
  imageUrl: string

  @Column({ type: 'varchar', length: 200, nullable: true })
  title: string | null

  @Column({ type: 'varchar', length: 300, nullable: true })
  subtitle: string | null

  @Column({ type: 'varchar', length: 500, nullable: true })
  linkUrl: string | null

  /** 버튼 텍스트 (예: "SHOP NOW", "VIEW MORE") */
  @Column({ type: 'varchar', length: 100, nullable: true, default: 'VIEW MORE' })
  buttonText: string | null

  @Column({ type: 'int', default: 0 })
  sortOrder: number

  @Column({ type: 'boolean', default: true })
  isVisible: boolean

  @Column({ type: 'timestamp', nullable: true })
  startAt: Date | null

  @Column({ type: 'timestamp', nullable: true })
  endAt: Date | null

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
