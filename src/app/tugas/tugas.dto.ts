import { OmitType, PickType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { PageRequestDto } from 'src/utils/page dto/page.dto';

export class TugasDto {
  @IsInt()
  id?: number;

  @IsString()
  title: string;

  @IsString()
  gambar: string;

  @IsString()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  jurusan_id: number;

  @IsString()
  @IsNotEmpty()
  status: string;

  @IsNumber()
  @IsNotEmpty()
  jumlah: number;
}

export class CreateTugasDto extends OmitType(TugasDto, ['id']) {}

export class UpdateTugasDto extends PickType(TugasDto, [
  'description',
  'title',
]) {}

export class UpdateTugasDtoMahasiswa extends OmitType(TugasDto, [
  'id',
  'description',
  'gambar',
  'jumlah',
  'jurusan_id',
  'title',
]) {}

export class CreateTugasArrayDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTugasDto)
  data: CreateTugasDto[];
}

export class findAllTugas extends PageRequestDto {
  @IsString()
  @IsOptional()
  title: string;
}
