import { Module } from '@nestjs/common';
import { TugasController } from './tugas.controller';
import { TugasService } from './tugas.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tugas } from './tugas.entity';
import { Jurusan } from '../jurusan/jurusan.entity';
import { UserKuliah } from '../auth/auth.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tugas, Jurusan, UserKuliah])],
  controllers: [TugasController],
  providers: [TugasService],
})
export class TugasModule {}
