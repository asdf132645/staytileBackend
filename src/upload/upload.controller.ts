import {
  Controller, Post, UploadedFile, UseInterceptors,
  BadRequestException, Query,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { UploadService } from './upload.service'
import { memoryStorage } from 'multer'

const MAX_SIZE = 10 * 1024 * 1024 // 10MB

@Controller('api/upload')
export class UploadController {
  constructor(private readonly service: UploadService) {}

  /**
   * POST /api/upload?folder=products
   * multipart/form-data  field: "file"
   * → { url: "https://assets.staytile.com/products/uuid.jpg" }
   */
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: MAX_SIZE },
      fileFilter: (_, file, cb) => {
        const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
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
}
