import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, Query, ParseIntPipe,
  HttpCode, HttpStatus,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('api/products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  /**
   * GET /api/products
   * ?mainCategorySlug=tile&subCategorySlug=600x600
   * ?mainCategorySlug=outlet&subCategorySlug=clearance
   * ?subCategoryId=3
   */
  @Get()
  findAll(
    @Query('mainCategorySlug') mainCategorySlug?: string,
    @Query('subCategorySlug')  subCategorySlug?:  string,
    @Query('subCategoryId')    subCategoryId?:    string,
    @Query('isVisible')        isVisible?:        string,
    @Query('search')           search?:           string,
  ) {
    return this.productService.findAll({
      mainCategorySlug,
      subCategorySlug,
      subCategoryId: subCategoryId ? Number(subCategoryId) : undefined,
      isVisible: isVisible === 'true' ? true : isVisible === 'false' ? false : undefined,
      search: search || undefined,
    });
  }

  /** GET /api/products/:id */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productService.findOne(id);
  }

  /** POST /api/products */
  @Post()
  create(@Body() dto: CreateProductDto) {
    return this.productService.create(dto);
  }

  /** PATCH /api/products/:id */
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductDto,
  ) {
    return this.productService.update(id, dto);
  }

  /** DELETE /api/products/:id */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productService.remove(id);
  }
}
