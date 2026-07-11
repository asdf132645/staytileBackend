import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { createR2Client } from './r2.client'
import { randomUUID } from 'crypto'
import * as sharp from 'sharp'

@Injectable()
export class UploadService {
  private readonly r2: ReturnType<typeof createR2Client>
  private readonly bucket: string
  private readonly publicUrl: string

  constructor(private config: ConfigService) {
    this.r2 = createR2Client(config)
    this.bucket    = config.get<string>('R2_BUCKET_NAME')!
    this.publicUrl = config.get<string>('R2_PUBLIC_URL')!
  }

  /**
   * 파일을 WebP로 변환 후 R2에 업로드하고 공개 URL 반환
   */
  async uploadFile(file: Express.Multer.File, folder = 'uploads'): Promise<string> {
    const key = `${folder}/${randomUUID()}.webp`

    // 모든 이미지를 WebP로 변환 (quality 85 — 화질 유지하면서 용량 최소화)
    const webpBuffer = await sharp(file.buffer)
      .webp({ quality: 85 })
      .toBuffer()

    await this.r2.send(
      new PutObjectCommand({
        Bucket:      this.bucket,
        Key:         key,
        Body:        webpBuffer,
        ContentType: 'image/webp',
      })
    )

    return `${this.publicUrl}/${key}`
  }

  /**
   * 기존 이미지 URL을 WebP로 변환하여 재업로드 (마이그레이션용)
   * 성공 시 새 URL 반환, 실패 시 원본 URL 반환
   */
  async convertToWebp(url: string): Promise<string> {
    if (!url || url.endsWith('.webp')) return url
    try {
      const key = url.replace(`${this.publicUrl}/`, '')
      if (!key || key === url) return url // 외부 URL 무시

      // R2에서 원본 다운로드
      const getResult = await this.r2.send(
        new GetObjectCommand({ Bucket: this.bucket, Key: key })
      )
      const chunks: Uint8Array[] = []
      for await (const chunk of getResult.Body as AsyncIterable<Uint8Array>) {
        chunks.push(chunk)
      }
      const originalBuffer = Buffer.concat(chunks)

      // WebP로 변환
      const webpBuffer = await sharp(originalBuffer)
        .webp({ quality: 85 })
        .toBuffer()

      // 새 키로 업로드
      const folder  = key.split('/')[0]
      const newKey  = `${folder}/${randomUUID()}.webp`
      await this.r2.send(
        new PutObjectCommand({
          Bucket:      this.bucket,
          Key:         newKey,
          Body:        webpBuffer,
          ContentType: 'image/webp',
        })
      )

      // 원본 삭제
      await this.deleteFile(url)

      return `${this.publicUrl}/${newKey}`
    } catch (e) {
      console.warn(`[R2] convertToWebp failed: ${url}`, e)
      return url // 실패 시 원본 유지
    }
  }

  /**
   * R2에서 파일 삭제
   */
  async deleteFile(url: string): Promise<void> {
    if (!url) return
    try {
      const key = url.replace(`${this.publicUrl}/`, '')
      if (!key || key === url) return
      await this.r2.send(
        new DeleteObjectCommand({ Bucket: this.bucket, Key: key })
      )
    } catch (e) {
      console.warn(`[R2] deleteFile failed: ${url}`, e)
    }
  }

  async deleteFiles(urls: (string | null | undefined)[]): Promise<void> {
    await Promise.allSettled(
      urls.filter(Boolean).map(url => this.deleteFile(url!))
    )
  }
}
