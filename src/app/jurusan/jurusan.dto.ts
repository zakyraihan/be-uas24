import { OmitType, PickType } from '@nestjs/mapped-types';
import { IsInt, IsNumber, IsOptional, IsString } from 'class-validator';
import { PageRequestDto } from 'src/utils/page dto/page.dto';

export class JurusanDto {
  @IsInt()
  id?: number;

  @IsString()
  nama_jurusan: string;

  @IsNumber()
  @IsOptional()
  peminat_jurusan: number;
}

export class CreateJurusanDto extends OmitType(JurusanDto, ['id']) {}

export class findAllJurusan extends PageRequestDto {
  @IsString()
  @IsOptional()
  nama_jurusan: string;
}

export class UpdateJurusanDto extends OmitType(JurusanDto, ['id']) {}
