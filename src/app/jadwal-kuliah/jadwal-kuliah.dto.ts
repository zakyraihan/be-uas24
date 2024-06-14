import { OmitType, PickType } from '@nestjs/mapped-types';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { PageRequestDto } from 'src/utils/page dto/page.dto';

export class JadwalDto {
  @IsInt()
  id?: number;

  @IsString()
  mata_kuliah: string;

  @IsString()
  hari: string;

  @IsString()
  waktuMulai: string;

  @IsString()
  waktuSelesai: string;

  @IsNumber()
  @IsNotEmpty()
  jurusan_id: number;

  @IsNumber()
  @IsNotEmpty()
  ruangan_id: number;

  @IsObject()
  @IsOptional()
  created_by: { id: number };

  @IsObject()
  @IsOptional()
  updated_by: { id: number };
}

export class CreateJadwalDto extends OmitType(JadwalDto, [
  'id',
  'created_by',
  'updated_by',
]) {}

export class findAllJadwal extends PageRequestDto {
  @IsString()
  @IsOptional()
  mata_kuliah: string;

  @IsString()
  @IsOptional()
  jurusan_id: string;

  @IsString()
  @IsOptional()
  nama_user: string;
}

export class UpdateJadwalDto extends OmitType(JadwalDto, [
  'id',
  'created_by',
  'jurusan_id',
  'ruangan_id',
  'updated_by',
]) {}
