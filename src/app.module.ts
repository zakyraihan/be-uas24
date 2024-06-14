import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { AuthModule } from './app/auth/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { MailModule } from './app/mail/mail.module';
import { JurusanModule } from './app/jurusan/jurusan.module';
import { RuanganModule } from './app/ruangan/ruangan.module';
import { UploadController } from './app/upload/upload.controller';
import { MahasiswaModule } from './app/mahasiswa/mahasiswa.module';
import { JadwalKuliahModule } from './app/jadwal-kuliah/jadwal-kuliah.module';
import { DiskusiModule } from './app/diskusi/diskusi.module';
import { TugasService } from './app/tugas/tugas.service';
import { TugasController } from './app/tugas/tugas.controller';
import { TugasModule } from './app/tugas/tugas.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(typeOrmConfig),
    AuthModule,
    MailModule,
    JurusanModule,
    RuanganModule,
    MahasiswaModule,
    JadwalKuliahModule,
    DiskusiModule,
    TugasModule,
  ],
  controllers: [AppController, UploadController],
  providers: [AppService],
})
export class AppModule {}
