import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

export interface ProductFilterQuery {
  mainCategorySlug?: string;
  subCategorySlug?:  string;
  subCategoryId?:    number;
}

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  async findAll(filter: ProductFilterQuery): Promise<Product[]> {
    const qb = this.productRepo
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.subCategory', 'sub')
      .leftJoinAndSelect('sub.mainCategory', 'main')
      .orderBy('p.sort_order', 'ASC')
      .addOrderBy('p.created_at', 'DESC');

    if (filter.mainCategorySlug) {
      qb.andWhere('main.slug = :mainSlug', { mainSlug: filter.mainCategorySlug });
    }
    if (filter.subCategorySlug) {
      qb.andWhere('sub.slug = :subSlug', { subSlug: filter.subCategorySlug });
    }
    if (filter.subCategoryId) {
      qb.andWhere('p.sub_category_id = :subCategoryId', { subCategoryId: filter.subCategoryId });
    }

    const products = await qb.getMany();
    return products.map((p) => this.serialize(p));
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepo.findOne({
      where: { id },
      relations: ['subCategory', 'subCategory.mainCategory'],
    });
    if (!product) throw new NotFoundException(`상품 #${id}를 찾을 수 없습니다.`);
    return this.serialize(product);
  }

  async create(dto: CreateProductDto): Promise<Product> {
    const product = this.productRepo.create({
      ...dto,
      slug: dto.slug || this.toSlug(dto.name),
    });
    const saved = await this.productRepo.save(product);
    return this.findOne(saved.id);
  }

  async update(id: number, dto: UpdateProductDto): Promise<Product> {
    const product = await this.productRepo.findOneBy({ id });
    if (!product) throw new NotFoundException(`상품 #${id}를 찾을 수 없습니다.`);
    Object.assign(product, dto);
    await this.productRepo.save(product);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const product = await this.productRepo.findOneBy({ id });
    if (!product) throw new NotFoundException(`상품 #${id}를 찾을 수 없습니다.`);
    await this.productRepo.remove(product);
  }

  /** 관계 객체에서 편의 필드를 추가하여 직렬화 */
  private serialize(p: Product): any {
    return {
      ...p,
      subCategoryName:  p.subCategory?.name,
      mainCategorySlug: p.subCategory?.mainCategory?.slug,
    };
  }

  private toSlug(name: string): string {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  }
}
