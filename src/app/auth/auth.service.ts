import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import BaseResponse from 'src/utils/response/base.response';
import { UserKuliah } from './auth.entity';
import { Repository } from 'typeorm';
import { LoginDto, RegisterDto, ResetPasswordDto } from './auth.dto';
import { ResponseSuccess } from 'src/interface/response';
import { compare, hash } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { jwt_config } from 'src/config/jwt_config';
import { MailService } from '../mail/mail.service';
import { randomBytes } from 'crypto';
import { ResetPassword } from './reset_password.entity';

@Injectable()
export class AuthService extends BaseResponse {
  constructor(
    @InjectRepository(UserKuliah)
    private readonly authRepo: Repository<UserKuliah>,
    @InjectRepository(ResetPassword)
    private readonly resetPasswordRepository: Repository<ResetPassword>, // inject repository reset password
    private jwtService: JwtService,
    private mailService: MailService,
  ) {
    super();
  }

  generateJWT(payload: jwtPayload, expiresIn: string | number, token: string) {
    return this.jwtService.sign(payload, {
      secret: token,
      expiresIn: expiresIn,
    });
  } //membuat method untuk generate jwt

  async register(payload: RegisterDto): Promise<ResponseSuccess> {
    const checkUserExist = await this.authRepo.findOne({
      where: {
        email: payload.email,
      },
    });

    if (checkUserExist) {
      throw new HttpException('User already registered', HttpStatus.FOUND);
    }

    if (!payload.role) {
      payload.role = 'admin';
    }

    payload.password = await hash(payload.password, 12);
    await this.authRepo.save(payload);

    console.log(`berhasil masuk sebagai ${payload.role}`);

    return this._success('Register berhasil');
  }

  async login(payload: LoginDto): Promise<ResponseSuccess> {
    const checkUserExists = await this.authRepo.findOne({
      where: {
        email: payload.email,
        nama: payload.nama,
      },
      select: {
        id: true,
        nama: true,
        email: true,
        password: true,
        refresh_token: true,
        role: true,
      },
    });

    if (!checkUserExists) {
      throw new HttpException(
        'User tidak ditemukan',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const checkPassword = await compare(
      payload.password,
      checkUserExists.password,
    ); // compare password yang dikirim dengan password yang ada di tabel

    if (checkPassword) {
      const jwtPayload: jwtPayload = {
        id: checkUserExists.id,
        nama: checkUserExists.nama,
        email: checkUserExists.email,
      };

      const access_token = await this.generateJWT(
        jwtPayload,
        '3d',
        jwt_config.access_token_secret,
      );

      const refresh_token = await this.generateJWT(
        jwtPayload,
        '7d',
        jwt_config.refresh_token_secret,
      );

      await this.authRepo.save({
        refresh_token: refresh_token,
        id: checkUserExists.id,
      }); // simpan refresh token ke dalam tabel

      return this._success('Login Success', {
        ...checkUserExists,
        access_token: access_token,
        refresh_token: refresh_token,
      });
    } else {
      throw new HttpException(
        'email dan password tidak sama',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  async refreshToken(id: number, token: string): Promise<ResponseSuccess> {
    const checkUserExists = await this.authRepo.findOne({
      where: {
        id: id,
        refresh_token: token,
      },
      select: {
        id: true,
        nama: true,
        email: true,
        password: true,
        refresh_token: true,
        role: true,
      },
    });

    console.log('user', checkUserExists);
    if (checkUserExists === null) {
      throw new UnauthorizedException();
    }

    const jwtPayload: jwtPayload = {
      id: checkUserExists.id,
      nama: checkUserExists.nama,
      email: checkUserExists.email,
    };

    const access_token = await this.generateJWT(
      jwtPayload,
      '3d',
      jwt_config.access_token_secret,
    );

    const refresh_token = await this.generateJWT(
      jwtPayload,
      '7d',
      jwt_config.refresh_token_secret,
    );

    await this.authRepo.save({
      refresh_token: refresh_token,
      id: checkUserExists.id,
    });

    return this._success('Success', {
      ...checkUserExists,
      access_token: access_token,
      refresh_token: refresh_token,
    });
  }

  async forgotPassword(email: string): Promise<ResponseSuccess> {
    const user = await this.authRepo.findOne({
      where: {
        email: email,
      },
    });

    if (!user) {
      throw new HttpException(
        'Email tidak ditemukan',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const token = randomBytes(32).toString('hex'); // membuat token
    const link = `http://localhost:3000/auth/reset-password/${user.id}/${token}`; //membuat link untuk reset password
    await this.mailService.sendForgotPassword({
      email: email,
      name: user.nama,
      link: link,
    });

    const payload = {
      user: {
        id: user.id,
      },
      token: token,
    };

    await this.resetPasswordRepository.save(payload); // menyimpan token dan id ke tabel reset password

    return this._success('Silahkan Cek Email');
  }

  async myProfile(id: number): Promise<ResponseSuccess> {
    const user = await this.authRepo.findOne({
      where: {
        id: id,
      },
    });

    return this._success('OK', user);
  }

  async getAllUsers(): Promise<ResponseSuccess> {
    const users = await this.authRepo.find(); // Mengambil semua user dari database
    return this._success('User list retrieved successfully', users);
  }

  async resetPassword(
    user_id: number,
    token: string,
    payload: ResetPasswordDto,
  ): Promise<ResponseSuccess> {
    const userToken = await this.resetPasswordRepository.findOne({
      //cek apakah user_id dan token yang sah pada tabel reset password
      where: {
        token: token,
        user: {
          id: user_id,
        },
      },
    });

    if (!userToken) {
      throw new HttpException(
        'Token tidak valid',
        HttpStatus.UNPROCESSABLE_ENTITY, // jika tidak sah , berikan pesan token tidak valid
      );
    }

    payload.new_password = await hash(payload.new_password, 12); //hash password
    await this.authRepo.save({
      // ubah password lama dengan password baru
      password: payload.new_password,
      id: user_id,
    });
    await this.resetPasswordRepository.delete({
      // hapus semua token pada tabel reset password yang mempunyai user_id yang dikirim, agar tidak bisa digunakan kembali
      user: {
        id: user_id,
      },
    });

    return this._success('Reset Passwod Berhasil, Silahkan login ulang');
  }
}
