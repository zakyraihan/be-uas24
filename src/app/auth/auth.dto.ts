import { PartialType, PickType } from '@nestjs/mapped-types';
import {
  IsEmail,
  IsInt,
  IsString,
  Length,
  Matches,
  MinLength,
} from 'class-validator';

export class UserDto {
  @IsInt()
  id: number;

  @IsString()
  @Matches(/^[^\s]+$/, { message: 'Nama tidak boleh mengandung spasi' })
  nama: string;

  @IsString()
  avatar: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @Matches(/^[0-9]+$/, { message: 'Password harus terdiri dari angka saja' })
  password: string;

  @IsString()
  refresh_token: string;

  @IsString()
  role: string;
}

export class RegisterDto extends PickType(UserDto, [
  'nama',
  'email',
  'password',
  'role',
]) {}

export class LoginDto extends PickType(UserDto, [
  'nama',
  'email',
  'password',
]) {}

export class ResetPasswordDto {
  @IsString()
  @MinLength(8)
  new_password: string;
}
