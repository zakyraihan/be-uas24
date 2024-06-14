import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserKuliah } from './auth.entity';
import { JwtModule } from '@nestjs/jwt';
import { JwtAccessTokenStrategy } from './jwtAccessToken.strategy';
import { JwtRefreshTokenStrategy } from './jwtRefreshToken.strategy';
import { ResetPassword } from './reset_password.entity';
import { MailModule } from '../mail/mail.module';
import { PassportModule } from '@nestjs/passport';
import { jwt_config } from 'src/config/jwt_config';
import { JadwalKuliah } from '../jadwal-kuliah/jadwal-kuliah.entity';
import { Diskusi } from '../diskusi/diskusi.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserKuliah,
      ResetPassword,
      JadwalKuliah,
      Diskusi,
    ]),
    PassportModule.register({
      defaultStrategy: 'jwt',
      property: 'user',
      session: false,
    }),
    JwtModule.register({
      secret: jwt_config.access_token_secret,
      signOptions: {
        expiresIn: jwt_config.expired,
      },
    }),
    MailModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAccessTokenStrategy, JwtRefreshTokenStrategy],
})
export class AuthModule {}
