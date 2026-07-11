import {
  Injectable, ConflictException, UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User, UserRole } from './entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { BusinessProfile } from '../business-profile/entities/business-profile.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(BusinessProfile)
    private readonly bizRepo: Repository<BusinessProfile>,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const exists = await this.userRepo.findOne({ where: { email: dto.email } });
    if (exists) throw new ConflictException('이미 사용 중인 이메일입니다.');

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = this.userRepo.create({
      email: dto.email,
      passwordHash,
      name: dto.name,
      role: UserRole.USER,
      phone:         dto.phone         ?? null,
      address:       dto.address       ?? null,
      addressDetail: dto.addressDetail ?? null,
    });
    await this.userRepo.save(user);
    return this.issueToken(user);
  }

  async login(dto: LoginDto) {
    const user = await this.userRepo.findOne({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException('이메일 또는 비밀번호가 올바르지 않습니다.');

    const ok = await bcrypt.compare(dto.password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('이메일 또는 비밀번호가 올바르지 않습니다.');

    return this.issueToken(user);
  }

  private issueToken(user: User) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id:    user.id,
        email: user.email,
        name:  user.name,
        role:  user.role,
      },
    };
  }

  async me(user: User) {
    const biz = await this.bizRepo.findOne({ where: { userId: user.id } })
    return {
      id:             user.id,
      email:          user.email,
      name:           user.name,
      role:           user.role,
      businessStatus: biz?.status ?? null,   // 'PENDING' | 'APPROVED' | 'REJECTED' | null
    };
  }
}
