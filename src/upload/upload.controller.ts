import {
  Controller, Post, UploadedFile, UseInterceptors,
  BadRequestException, Query, Get,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UploadService } from './upload.service'
import { memoryStorage } from 'multer'
import { Product } from '../product/entities/product.entity'
import { Banner } from '../banner/entities/banner.entity'
import { SubCategory } from '../category/entities/sub-category.entity'

const MAX_SIZE = 20 * 1024 * 1024 // 20MB

@Controller('api/upload')
export class UploadController {
  constructor(
    private readonly service: UploadService,
    @InjectRepository(Product)     private readonly productRepo: Repository<Product>,
    @InjectRepository(Banner)      private readonly bannerRepo:  Repository<Banner>,
    @InjectRepository(SubCategory) private readonly subCatRepo:  Repository<SubCategory>,
  ) {}

  /**
   * POST /api/upload?folder=products
   * multipart/form-data  field: "file"
   * → 자동으로 WebP 변환 후 업로드
   */
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: MAX_SIZE },
      fileFilter: (_, file, cb) => {
        const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']
        if (!allowed.includes(file.mimetype)) {
          return cb(new BadRequestException('이미지 파일만 업로드 가능합니다 (jpg, png, webp, gif)'), false)
        }
        cb(null, true)
      },
    })
  )
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Query('folder') folder = 'uploads',
  ) {
    if (!file) throw new BadRequestException('파일이 없습니다.')
    const url = await this.service.uploadFile(file, folder)
    return { url }
  }

  /**
   * GET /api/upload/migrate-webp
   * 기존 PNG/JPG 이미지들을 WebP로 일괄 변환
   * (상품 썸네일, 추가이미지, 배너 이미지 전부)
   */
  @Get('migrate-webp')
  async migrateToWebp() {
    const results = { converted: 0, skipped: 0, failed: 0, details: [] as string[] }

    // ── 상품 이미지 변환 ─────────────────────────────────────
    const products = await this.productRepo.find()
    for (const p of products) {
      let changed = false

      // 썸네일
      if (p.thumbnail && !p.thumbnail.endsWith('.webp')) {
        const newUrl = await this.service.convertToWebp(p.thumbnail)
        if (newUrl !== p.thumbnail) {
          p.thumbnail = newUrl
          changed = true
          results.converted++
          results.details.push(`product#${p.id} thumbnail → ${newUrl}`)
        } else {
          results.failed++
        }
      } else if (p.thumbnail) {
        results.skipped++
      }

      // 추가 이미지
      if (p.images?.length) {
        const newImages: string[] = []
        for (const img of p.images) {
          if (!img.endsWith('.webp')) {
            const newUrl = await this.service.convertToWebp(img)
            newImages.push(newUrl)
            if (newUrl !== img) { results.converted++; changed = true }
            else results.failed++
          } else {
            newImages.push(img)
            results.skipped++
          }
        }
        p.images = newImages
      }

      // description HTML 안의 이미지 URL 변환
      if (p.description) {
        const imgRegex = /src="(https?:\/\/[^"]+\.(png|jpg|jpeg|gif))"/gi
        let desc = p.description
        let match: RegExpExecArray | null
        const replacements: Array<{ old: string; new: string }> = []
        while ((match = imgRegex.exec(p.description)) !== null) {
          replacements.push({ old: match[1], new: '' })
        }
        for (const r of replacements) {
          const newUrl = await this.service.convertToWebp(r.old)
          if (newUrl !== r.old) {
            desc = desc.split(r.old).join(newUrl)
            results.converted++
            changed = true
            results.details.push(`product#${p.id} desc img → ${newUrl}`)
          } else {
            results.skipped++
          }
        }
        if (desc !== p.description) p.description = desc
      }

      if (changed) await this.productRepo.save(p)
    }

    // ── 배너 이미지 변환 ─────────────────────────────────────
    const banners = await this.bannerRepo.find()
    for (const b of banners) {
      if (b.imageUrl && !b.imageUrl.endsWith('.webp')) {
        const newUrl = await this.service.convertToWebp(b.imageUrl)
        if (newUrl !== b.imageUrl) {
          b.imageUrl = newUrl
          await this.bannerRepo.save(b)
          results.converted++
          results.details.push(`banner#${b.id} → ${newUrl}`)
        } else {
          results.failed++
        }
      } else if (b.imageUrl) {
        results.skipped++
      }
    }

    // ── 서브카테고리 썸네일 변환 ─────────────────────────────
    const subCats = await this.subCatRepo.find()
    for (const s of subCats) {
      if (s.thumbnailUrl && !s.thumbnailUrl.endsWith('.webp')) {
        const newUrl = await this.service.convertToWebp(s.thumbnailUrl)
        if (newUrl !== s.thumbnailUrl) {
          s.thumbnailUrl = newUrl
          await this.subCatRepo.save(s)
          results.converted++
          results.details.push(`subcat#${s.id} → ${newUrl}`)
        } else {
          results.failed++
        }
      } else if (s.thumbnailUrl) {
        results.skipped++
      }
    }

    return results
  }
}
