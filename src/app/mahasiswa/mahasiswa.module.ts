import { Module } from '@nestjs/common';
import { MahasiswaController } from './mahasiswa.controller';
import { MahasiswaService } from './mahasiswa.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mahasiswa } from './mahasiswa.entity';
import { Jurusan } from '../jurusan/jurusan.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Mahasiswa, Jurusan])],
  controllers: [MahasiswaController],
  providers: [MahasiswaService],
})
export class MahasiswaModule {}
