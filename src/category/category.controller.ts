import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, ParseIntPipe, HttpCode, HttpStatus,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CreateSubCategoryDto } from './dto/create-sub-category.dto';
import { UpdateSubCategoryDto } from './dto/update-sub-category.dto';

@Controller('api/categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  // ── GNB / 프론트 전용 ────────────────────────────────────────

  /** GET /api/categories/menu — 프론트 GNB 메뉴 트리 */
  @Get('menu')
  getMenu() {
    return this.categoryService.getMenuTree();
  }

  /** GET /api/categories/:mainSlug/:subSlug — [sub].vue 진입 시 templateType 조회 */
  @Get(':mainSlug/:subSlug')
  getSubDetail(
    @Param('mainSlug') mainSlug: string,
    @Param('subSlug')  subSlug:  string,
  ) {
    return this.categoryService.getSubCategoryDetail(mainSlug, subSlug);
  }

  // ── 메인 카테고리 CRUD (관리자) ──────────────────────────────

  /** GET /api/categories — 전체 목록 (서브 포함) */
  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  /** GET /api/categories/:id */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.findOne(id);
  }

  /** POST /api/categories */
  @Post()
  create(@Body() dto: CreateCategoryDto) {
    return this.categoryService.create(dto);
  }

  /** PATCH /api/categories/:id */
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(id, dto);
  }

  /** DELETE /api/categories/:id */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.remove(id);
  }
}

// ── 서브 카테고리 컨트롤러 ────────────────────────────────────

@Controller('api/sub-categories')
export class SubCategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  /** POST /api/sub-categories */
  @Post()
  create(@Body() dto: CreateSubCategoryDto) {
    return this.categoryService.createSub(dto);
  }

  /** PATCH /api/sub-categories/:id */
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSubCategoryDto,
  ) {
    return this.categoryService.updateSub(id, dto);
  }

  /** DELETE /api/sub-categories/:id */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.removeSub(id);
  }
}
