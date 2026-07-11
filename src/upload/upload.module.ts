import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UploadService } from './upload.service'
import { UploadController } from './upload.controller'
import { Product } from '../product/entities/product.entity'
import { Banner } from '../banner/entities/banner.entity'

@Module({
  imports:     [TypeOrmModule.forFeature([Product, Banner])],
  providers:   [UploadService],
  controllers: [UploadController],
  exports:     [UploadService],
})
export class UploadModule {}
