import { Module } from '@nestjs/common';
import { JadwalKuliahController } from './jadwal-kuliah.controller';
import { JadwalKuliahService } from './jadwal-kuliah.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JadwalKuliah } from './jadwal-kuliah.entity';
import { UserKuliah } from '../auth/auth.entity';
import { Ruangan } from '../ruangan/ruangan.entity';
import { Jurusan } from '../jurusan/jurusan.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([JadwalKuliah, UserKuliah, Ruangan, Jurusan]),
  ],
  controllers: [JadwalKuliahController],
  providers: [JadwalKuliahService],
})
export class JadwalKuliahModule {}
