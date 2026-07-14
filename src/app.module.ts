import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { ShippingModule } from './shipping/shipping.module';
import { BannerModule } from './banner/banner.module';
import { UploadModule } from './upload/upload.module';
import { SiteConfigModule } from './site-config/site-config.module';
import { NoticeModule } from './notice/notice.module';
import { AuthModule } from './auth/auth.module';
import { BusinessProfileModule } from './business-profile/business-profile.module';
import { OrderModule } from './order/order.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { ShowroomModule } from './showroom/showroom.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    CategoryModule,
    ProductModule,
    ShippingModule,
    BannerModule,
    UploadModule,
    SiteConfigModule,
    NoticeModule,
    AuthModule,
    BusinessProfileModule,
    OrderModule,
    AnalyticsModule,
    ShowroomModule,
  ],
})
export class AppModule {}
