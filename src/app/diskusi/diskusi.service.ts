import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import BaseResponse from 'src/utils/response/base.response';
import { UserKuliah } from '../auth/auth.entity';
import { REQUEST } from '@nestjs/core';
import { Like, Repository } from 'typeorm';
import {
  CreateDiskusiDto,
  UpdateDiskusiDto,
  findAllDiskusi,
} from './diskusi.dto';
import { Diskusi } from './diskusi.entity';
import { ResponsePagination, ResponseSuccess } from 'src/interface/response';

@Injectable()
export class DiskusiService extends BaseResponse {
  constructor(
    @InjectRepository(Diskusi)
    private readonly diskusiRepo: Repository<Diskusi>,
    @InjectRepository(UserKuliah)
    private readonly UserRepository: Repository<UserKuliah>,
    @Inject(REQUEST) private req: any,
  ) {
    super();
  }

  async create(payload: CreateDiskusiDto): Promise<ResponseSuccess> {
    try {
      await this.diskusiRepo.save({
        ...payload,
        user: {
          id: this.req.user.id,
        },
      });

      return this._success('OK', payload);
    } catch {
      throw new HttpException('Ada Kesalahan', HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }

  async getAllDiskusi(query: findAllDiskusi): Promise<ResponsePagination> {
    const { page, pageSize, limit, komentar } = query;

    const filterQuery: any = {};
    if (komentar) {
      filterQuery.komentar = Like(`%${komentar}%`);
    }

    const total = await this.diskusiRepo.count({ where: filterQuery });

    console.log('Qwery', filterQuery);

    const result = await this.diskusiRepo.find({
      where: filterQuery,
      relations: ['user'],
      select: {
        id: true,
        komentar: true,
        user: {
          id: true,
          nama: true,
        },
        created_at: true,
      },
    });

    return this._pagination('Okeh', result, total, page, pageSize);
  }

  async deleteDiskusi(id: number): Promise<ResponseSuccess> {
    const check = await this.diskusiRepo.findOne({
      relations: ['user'], // Ensure the user relation is loaded
      where: {
        id,
      },
    });

    if (!check)
      throw new NotFoundException(`diskusi dengan id ${id} tidak ditemukan`);

    if (check.user.id !== this.req.user.id) {
      throw new ForbiddenException(
        `Anda tidak diizinkan untuk menghapus diskusi ini`,
      );
    }

    await this.diskusiRepo.delete(id);
    return {
      status: `Success `,
      message: 'Berhasil menghapus diskusi',
    };
  }

  async updateBook(
    id: number,
    updateDiskusi: UpdateDiskusiDto,
  ): Promise<ResponseSuccess> {
    const check = await this.diskusiRepo.findOne({
      relations: ['user'], // Ensure the user relation is loaded
      where: {
        id,
      },
    });

    if (check.user.id !== this.req.user.id) {
      throw new ForbiddenException(
        `Anda tidak diizinkan untuk mengedit diskusi ini`,
      );
    }

    if (!check)
      throw new NotFoundException(`diskusi dengan id ${id} tidak ditemukan`);

    const update = await this.diskusiRepo.save({ ...updateDiskusi, id: id });
    return {
      status: `Success `,
      message: 'diskusi berhasil di update',
      data: update,
    };
  }
}
