import { Module } from '@nestjs/common';
import { RuanganController } from './ruangan.controller';
import { RuanganService } from './ruangan.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ruangan } from './ruangan.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ruangan])],
  controllers: [RuanganController],
  providers: [RuanganService]
})
export class RuanganModule {}
