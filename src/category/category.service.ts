import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { SubCategory } from './entities/sub-category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CreateSubCategoryDto } from './dto/create-sub-category.dto';
import { UpdateSubCategoryDto } from './dto/update-sub-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,

    @InjectRepository(SubCategory)
    private readonly subCategoryRepo: Repository<SubCategory>,
  ) {}

  // ── 메뉴 트리 인메모리 캐시 (30초) ─────────────────────────
  private _menuCache: any = null;
  private _menuCacheAt = 0;
  private readonly MENU_TTL = 30_000; // 30초

  private invalidateMenuCache() {
    this._menuCache = null;
    this._menuCacheAt = 0;
  }

  // ── 메인 카테고리 ────────────────────────────────────────────

  async findAll(): Promise<Category[]> {
    return this.categoryRepo.find({
      relations: ['subCategories'],
      order: { sortOrder: 'ASC', subCategories: { sortOrder: 'ASC' } },
    });
  }

  async findOne(id: number): Promise<Category> {
    const cat = await this.categoryRepo.findOne({
      where: { id },
      relations: ['subCategories'],
    });
    if (!cat) throw new NotFoundException(`카테고리 #${id}를 찾을 수 없습니다.`);
    return cat;
  }

  async create(dto: CreateCategoryDto): Promise<Category> {
    const exists = await this.categoryRepo.findOneBy({ slug: dto.slug });
    if (exists) throw new ConflictException(`슬러그 '${dto.slug}'가 이미 사용 중입니다.`);
    const category = this.categoryRepo.create(dto);
    const saved = await this.categoryRepo.save(category);
    this.invalidateMenuCache();
    return saved;
  }

  async update(id: number, dto: UpdateCategoryDto): Promise<Category> {
    const category = await this.findOne(id);
    Object.assign(category, dto);
    const saved = await this.categoryRepo.save(category);
    this.invalidateMenuCache();
    return saved;
  }

  async remove(id: number): Promise<void> {
    const category = await this.findOne(id);
    await this.categoryRepo.remove(category);
    this.invalidateMenuCache();
  }

  /** GNB 메뉴 트리 — 프론트 전용 (노출 여부 필터 적용, 30초 캐시) */
  async getMenuTree() {
    const now = Date.now();
    if (this._menuCache && now - this._menuCacheAt < this.MENU_TTL) {
      return this._menuCache;
    }

    const categories = await this.categoryRepo.find({
      where: { isVisible: true },
      relations: ['subCategories'],
      order: { sortOrder: 'ASC' },
    });

    const result = categories.map((cat) => ({
      slug: cat.slug,
      name: cat.name,
      subCategories: cat.subCategories
        .filter((s) => s.isVisible)
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((s) => ({
          slug:         s.slug,
          name:         s.name,
          templateType: s.templateType,
          aspectRatio:  s.aspectRatio,
          thumbnailUrl: s.thumbnailUrl,
        })),
    }));

    this._menuCache   = result;
    this._menuCacheAt = now;
    return result;
  }

  /** 특정 서브 카테고리 상세 (templateType 포함) — [main]/[sub].vue 진입 시 */
  async getSubCategoryDetail(mainSlug: string, subSlug: string) {
    const sub = await this.subCategoryRepo
      .createQueryBuilder('sub')
      .innerJoinAndSelect('sub.mainCategory', 'main')
      .where('main.slug = :mainSlug', { mainSlug })
      .andWhere('sub.slug = :subSlug', { subSlug })
      .andWhere('sub.is_visible = 1')
      .getOne();

    if (!sub) throw new NotFoundException(`카테고리 '${mainSlug}/${subSlug}'를 찾을 수 없습니다.`);

    return {
      slug:         sub.slug,
      name:         sub.name,
      templateType: sub.templateType,
      aspectRatio:  sub.aspectRatio,
      mainSlug:     sub.mainCategory.slug,
      mainName:     sub.mainCategory.name,
    };
  }

  // ── 서브 카테고리 ────────────────────────────────────────────

  async createSub(dto: CreateSubCategoryDto): Promise<SubCategory> {
    await this.findOne(dto.mainCategoryId);
    const exists = await this.subCategoryRepo.findOneBy({
      mainCategoryId: dto.mainCategoryId,
      slug: dto.slug,
    });
    if (exists) throw new ConflictException(`슬러그 '${dto.slug}'가 이미 존재합니다.`);
    const sub = this.subCategoryRepo.create(dto);
    const saved = await this.subCategoryRepo.save(sub);
    this.invalidateMenuCache();
    return saved;
  }

  async updateSub(id: number, dto: UpdateSubCategoryDto): Promise<SubCategory> {
    const sub = await this.subCategoryRepo.findOneBy({ id });
    if (!sub) throw new NotFoundException(`서브 카테고리 #${id}를 찾을 수 없습니다.`);
    Object.assign(sub, dto);
    const saved = await this.subCategoryRepo.save(sub);
    this.invalidateMenuCache();
    return saved;
  }

  async removeSub(id: number): Promise<void> {
    const sub = await this.subCategoryRepo.findOneBy({ id });
    if (!sub) throw new NotFoundException(`서브 카테고리 #${id}를 찾을 수 없습니다.`);
    await this.subCategoryRepo.remove(sub);
    this.invalidateMenuCache();
  }
}
