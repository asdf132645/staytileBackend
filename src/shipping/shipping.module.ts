import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShippingFee } from './entities/shipping-fee.entity';
import { ShippingService } from './shipping.service';
import { ShippingController } from './shipping.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ShippingFee])],
  controllers: [ShippingController],
  providers: [ShippingService],
})
export class ShippingModule {}
