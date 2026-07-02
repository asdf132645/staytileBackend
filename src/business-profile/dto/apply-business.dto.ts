import { IsString, MinLength, MaxLength, Matches } from 'class-validator';

export class ApplyBusinessDto {
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  companyName: string;

  /** 000-00-00000 형식 */
  @IsString()
  @Matches(/^\d{3}-\d{2}-\d{5}$/, { message: '사업자 번호 형식은 000-00-00000 이어야 합니다.' })
  businessNumber: string;
}
