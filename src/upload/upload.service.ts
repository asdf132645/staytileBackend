import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { createR2Client } from './r2.client'
import { extname } from 'path'
import { randomUUID } from 'crypto'

@Injectable()
export class UploadService {
  private readonly r2: ReturnType<typeof createR2Client>
  private readonly bucket: string
  private readonly publicUrl: string

  constructor(private config: ConfigService) {
    this.r2 = createR2Client(config)
    this.bucket    = config.get<string>('R2_BUCKET_NAME')!
    this.publicUrl = config.get<string>('R2_PUBLIC_URL')!  // https://assets.staytile.com 또는 pub-xxx.r2.dev
  }

  /**
   * 파일을 R2에 업로드하고 공개 URL 반환
   * @param file  multer Express.Multer.File
   * @param folder  'products' | 'banners' | 'etc'
   */
  async uploadFile(file: Express.Multer.File, folder = 'uploads'): Promise<string> {
    const ext      = extname(file.originalname).toLowerCase()
    const key      = `${folder}/${randomUUID()}${ext}`
    const mimeType = file.mimetype

    await this.r2.send(
      new PutObjectCommand({
        Bucket:      this.bucket,
        Key:         key,
        Body:        file.buffer,
        ContentType: mimeType,
        // R2 퍼블릭 버킷이면 ACL 불필요 — 버킷 자체를 Public으로 설정
      })
    )

    return `${this.publicUrl}/${key}`
  }

  /**
   * R2에서 파일 삭제
   * @param url  R2 공개 URL (https://assets.staytile.com/products/xxx.jpg)
   */
  async deleteFile(url: string): Promise<void> {
    if (!url) return
    try {
      // URL에서 key 추출: publicUrl 이후 경로
      const key = url.replace(`${this.publicUrl}/`, '')
      if (!key || key === url) return // 외부 URL이면 무시
      await this.r2.send(
        new DeleteObjectCommand({ Bucket: this.bucket, Key: key })
      )
    } catch (e) {
      // 삭제 실패해도 서비스 흐름 중단 안 함 (로그만)
      console.warn(`[R2] deleteFile failed: ${url}`, e)
    }
  }

  /** 여러 URL 배치 삭제 */
  async deleteFiles(urls: (string | null | undefined)[]): Promise<void> {
    await Promise.allSettled(
      urls.filter(Boolean).map(url => this.deleteFile(url!))
    )
  }
}
