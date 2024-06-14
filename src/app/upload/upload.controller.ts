import {
  Controller,
  Delete,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtGuard } from '../auth/auth.guard';
import BaseResponse from 'src/utils/Response/base.response';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as fs from 'fs';
import { FileValidator } from 'src/utils/validator/file.validator';
import { ResponseSuccess } from 'src/interface/response';

@UseGuards(JwtGuard)
@Controller('upload')
export class UploadController extends BaseResponse {
  constructor() {
    super();
  }

  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: 'public/uploads',
        filename: (req, file, cb) => {
          const fileExtension = file.originalname.split('.').pop();
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}.${fileExtension}`);
        },
      }),
    }),
  )
  @Post('file')
  async uploadFile(
    @UploadedFile()
    file: Express.Multer.File,
  ): Promise<ResponseSuccess> {
    try {
      FileValidator.validateFile(
        file,
        ['.jpg', '.pdf', '.png', '.jpeg', '.docx'],
        2 * 5000 * 5000,
      );
      const url = `http://localhost:2005/uploads/${file.filename}`;

      return this._success('OK', {
        file_url: url,
        file_name: file.filename,
        file_size: file.size,
      });
    } catch (error) {
      throw new HttpException('File upload failed', HttpStatus.BAD_REQUEST);
    }
  }

  @UseInterceptors(
    FilesInterceptor('files', 20, {
      storage: diskStorage({
        destination: 'public/uploads',
        filename: (req, file, cb) => {
          const fileExtension = file.originalname.split('.').pop();
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}.${fileExtension}`);
        },
      }),
    }),
  )
  @Post('files')
  async uploadFileMulti(
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<ResponseSuccess> {
    try {
      const file_response: Array<{
        file_url: string;
        file_name: string;
        file_size: number;
      }> = [];

      files.forEach((file) => {
        FileValidator.validateFile(
          file,
          ['.jpg', '.pdf', '.png', '.jpeg', '.docx'],
          2 * 5000 * 5000,
        );
        const url = `http://localhost:2005/uploads/${file.filename}`;
        file_response.push({
          file_url: url,
          file_name: file.filename,
          file_size: file.size,
        });
      });

      return this._success('OK', {
        files: file_response,
      });
    } catch (err) {
      throw new HttpException('File upload failed', HttpStatus.BAD_REQUEST);
    }
  }

  @Delete('/file/delete/:filename')
  async DeleteFile(
    @Param('filename') filename: string,
  ): Promise<ResponseSuccess> {
    try {
      const filePath = `public/uploads/${filename}`;
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        return this._success('File successfully deleted');
      } else {
        throw new HttpException('File not found', HttpStatus.NOT_FOUND);
      }
    } catch (err) {
      throw new HttpException(
        'Failed to delete file',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
