import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Showroom } from './entities/showroom.entity';
import { ShowroomService } from './showroom.service';
import { ShowroomController } from './showroom.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Showroom])],
  providers: [ShowroomService],
  controllers: [ShowroomController],
})
export class ShowroomModule {}
