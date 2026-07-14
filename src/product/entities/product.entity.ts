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

  /** 관리자 내부용 기존 상품명 — 프론트에 노출 안 됨 */
  @Column({ name: 'internal_name', length: 200, nullable: true, default: null })
  internalName: string | null;

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

  /** 대표 이미지 alt 텍스트 (SEO) */
  @Column({ name: 'thumbnail_alt', length: 300, nullable: true, default: null })
  thumbnailAlt: string | null;

  @Column({ type: 'json', nullable: true })
  images: string[] | null;

  /** 추가 이미지 alt 텍스트 배열 (images 와 인덱스 1:1 대응, SEO) */
  @Column({ name: 'image_alts', type: 'json', nullable: true, default: null })
  imageAlts: string[] | null;

  @Column({ type: 'longtext', nullable: true })
  description: string | null;  // TipTap HTML

  @Column({ length: 80, nullable: true })
  color: string | null;

  @Column({ name: 'color_name', length: 80, nullable: true })
  colorName: string | null;

  /** 원산지 (예: Italy, Korea) */
  @Column({ length: 100, nullable: true, default: null })
  origin: string | null;

  /** 규격 (예: 600×600mm (두께 9mm)) */
  @Column({ length: 200, nullable: true, default: null })
  spec: string | null;

  /** 재질 표시 텍스트 (예: Porcelain (벽, 바닥 사용 가능)) */
  @Column({ length: 200, nullable: true, default: null })
  material: string | null;

  /**
   * 타일 재질 분류 — 접착제/줄눈 계산기 분기용
   * 'porcelain' = 자기질/포세린 (흡수율 0.5% 이하, 폴리머계 접착제 필수)
   * 'stoneware' = 석기질 (흡수율 3% 이하)
   * 'ceramic'   = 도기질 (흡수율 높음, 일반 압착 시멘트 가능)
   */
  @Column({ name: 'tile_type', length: 20, nullable: true, default: null })
  tileType: string | null;

  /** 판매단위 (예: Box (600×600mm × 3장=1.08㎡)) */
  @Column({ name: 'sales_unit', length: 300, nullable: true, default: null })
  salesUnit: string | null;

  /** 샘플 안내 문구 (기본값: "샘플은 실제 상품 크기와 동일한 크기로 발송됩니다.") */
  @Column({ name: 'sample_note', length: 300, nullable: true, default: null })
  sampleNote: string | null;

  /** 인증마크 배열 [{ image, title, description }] */
  @Column({ name: 'cert_marks', type: 'json', nullable: true, default: null })
  certMarks: Array<{ image: string; title: string; description: string }> | null;

  /** 상품 상세 하단 시공 안내 섹션 표시 여부 */
  @Column({ name: 'show_construction_guide', default: false })
  showConstructionGuide: boolean;

  /** QR 코드 랜딩 페이지 전용 설명글 (일반 상세와 별도) */
  @Column({ name: 'qr_description', type: 'text', nullable: true, default: null })
  qrDescription: string | null;

  @Column({ name: 'is_visible', default: true })
  isVisible: boolean;

  /** 상품 상세에 박스 계산기 표시 여부 */
  @Column({ name: 'show_calculator', default: true })
  showCalculator: boolean;

  @Column({ name: 'sort_order', default: 0 })
  sortOrder: number;

  /** 상품 템플릿 타입 (서브카테고리에서 상속) */
  @Column({ name: 'template_type', length: 30, nullable: true, default: null })
  templateType: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
