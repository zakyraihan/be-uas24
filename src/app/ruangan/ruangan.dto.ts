import { OmitType } from '@nestjs/mapped-types';
import { IsInt, IsNumber, IsOptional, IsString } from 'class-validator';
import { PageRequestDto } from 'src/utils/page dto/page.dto';

export class RuanganDto {
  @IsInt()
  id?: number;

  @IsString()
  nama_ruangan: string;

  @IsNumber()
  kapasitas_ruangan: number;

  @IsString()
  gambar_ruangan: string;
}

export class CreateRuanganDto extends OmitType(RuanganDto, ['id']) {}

export class findAllRuangan extends PageRequestDto {
  @IsString()
  @IsOptional()
  nama_ruangan: string;
}
