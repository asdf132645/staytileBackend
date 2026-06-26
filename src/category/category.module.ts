import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { SubCategory } from './entities/sub-category.entity';
import { CategoryService } from './category.service';
import { CategoryController, SubCategoryController } from './category.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Category, SubCategory])],
  controllers: [CategoryController, SubCategoryController],
  providers: [CategoryService],
  exports: [CategoryService],
})
export class CategoryModule {}
