import { Module } from '@nestjs/common';
import { DiskusiController } from './diskusi.controller';
import { DiskusiService } from './diskusi.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserKuliah } from '../auth/auth.entity';
import { Diskusi } from './diskusi.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserKuliah, Diskusi])],
  controllers: [DiskusiController],
  providers: [DiskusiService],
})
export class DiskusiModule {}
