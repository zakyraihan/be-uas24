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

export class DiskusiDto {
  @IsInt()
  id?: number;

  @IsString()
  komentar: string;

  @IsObject()
  @IsOptional()
  created_by: { id: number };

  //   @IsObject()
  //   @IsOptional()
  //   updated_by: { id: number };
}

export class CreateDiskusiDto extends OmitType(DiskusiDto, [
  'id',
  'created_by',
  //   'updated_by',
]) {}

export class findAllDiskusi extends PageRequestDto {
  @IsString()
  @IsOptional()
  komentar: string;
}

export class UpdateDiskusiDto extends OmitType(DiskusiDto, [
  'id',
  'created_by',
]) {}
