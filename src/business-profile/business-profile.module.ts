import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusinessProfile } from './entities/business-profile.entity';
import { BusinessProfileService } from './business-profile.service';
import { BusinessProfileController } from './business-profile.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([BusinessProfile]),
    AuthModule,
  ],
  providers: [BusinessProfileService],
  controllers: [BusinessProfileController],
})
export class BusinessProfileModule {}
