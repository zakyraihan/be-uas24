import { OmitType, PartialType, PickType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { PageRequestDto } from 'src/utils/page dto/page.dto';
import { JurusanDto } from '../jurusan/jurusan.dto';

export class MahasiswaDto {
  @IsInt()
  id?: number;

  @IsString()
  foto_mahasiswa: string;

  @IsString()
  nama_mahasiswa: string;

  @IsNumber()
  umur: number;

  @IsString()
  asal: string;

  @IsString()
  tanggal_lahir: string;

  @IsString()
  alamat: string;

  @IsString()
  nama_ortu: string;

  @IsNumber()
  nim: number;

  @IsNumber()
  @IsNotEmpty()
  jurusan_id: number;

  @IsNumber()
  @IsNotEmpty()
  ruangan_id: number;

  @ValidateNested({ each: true })
  @Type(() => JurusanDto)
  jurusan_detail: JurusanDto[];
}

export class CreateMahasiswaDto extends OmitType(MahasiswaDto, ['id']) {}

export class UpdateMahasiswaDto extends PartialType(MahasiswaDto) {
  jurusan_id?: number;
  ruangan_id?: number;
}

export class CreateMahasiswaArrayDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMahasiswaDto)
  data: CreateMahasiswaDto[];
}

export class findAllMahasiswa extends PageRequestDto {
  @IsString()
  @IsOptional()
  nama_mahasiswa: string;

  @IsString()
  @IsOptional()
  nim: string;
}
