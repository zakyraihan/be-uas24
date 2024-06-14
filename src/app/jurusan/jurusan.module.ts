import { Module } from '@nestjs/common';
import { JurusanController } from './jurusan.controller';
import { JurusanService } from './jurusan.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Jurusan } from './jurusan.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Jurusan])],
  controllers: [JurusanController],
  providers: [JurusanService],
})
export class JurusanModule {}
