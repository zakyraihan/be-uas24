import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import BaseResponse from 'src/utils/response/base.response';
import { JadwalKuliah } from './jadwal-kuliah.entity';
import { Like, Repository } from 'typeorm';
import { UserKuliah } from '../auth/auth.entity';
import { REQUEST } from '@nestjs/core';
import {
  CreateJadwalDto,
  UpdateJadwalDto,
  findAllJadwal,
} from './jadwal-kuliah.dto';
import { ResponsePagination, ResponseSuccess } from 'src/interface/response';
import { Jurusan } from '../jurusan/jurusan.entity';

@Injectable()
export class JadwalKuliahService extends BaseResponse {
  constructor(
    @InjectRepository(JadwalKuliah)
    private readonly jadwalRepo: Repository<JadwalKuliah>,
    @InjectRepository(UserKuliah)
    private readonly UserRepository: Repository<UserKuliah>,
    @Inject(REQUEST) private req: any,
  ) {
    super();
  }

  async create(payload: CreateJadwalDto): Promise<ResponseSuccess> {
    try {
      await this.jadwalRepo.save({
        ...payload,
        dosen: {
          id: this.req.user.id,
        },
        ruang_kuliah: {
          id: payload.ruangan_id,
        },
        jurusan: {
          id: payload.jurusan_id,
        },
      });

      return this._success('OK', payload);
    } catch {
      throw new HttpException('Ada Kesalahan', HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }

  async getAllJadwal(query: findAllJadwal): Promise<ResponsePagination> {
    const { page, pageSize, limit, mata_kuliah, jurusan_id, nama_user } = query;

    const filterQuery: any = {};
    if (mata_kuliah) {
      filterQuery.mata_kuliah = Like(`%${mata_kuliah}%`);
    }
    if (jurusan_id) {
      filterQuery.jurusan_id = Like(`%${jurusan_id}%`);
    }
    if (jurusan_id) {
      filterQuery.created_by = {
        nama: Like(`%${nama_user}%`),
      };
    }

    const total = await this.jadwalRepo.count({ where: filterQuery });

    console.log('Qwery', filterQuery);

    const result = await this.jadwalRepo.find({
      where: filterQuery,
      relations: ['jurusan', 'ruang_kuliah', 'dosen', 'updated_by'],
      order: { id: 'DESC' },
      select: {
        id: true,
        mata_kuliah: true,
        hari: true,
        waktuMulai: true,
        waktuSelesai: true,
        jurusan: {
          id: true,
          nama_jurusan: true,
        },
        ruang_kuliah: {
          id: true,
          nama_ruangan: true,
        },
        dosen: {
          id: true,
          nama: true,
        },
        updated_by: {
          id: true,
          nama: true,
        },
      },
      skip: limit,
      take: pageSize,
    });

    return this._pagination('Okeh', result, total, page, pageSize);
  }

  async deleteJadwal(id: number): Promise<ResponseSuccess> {
    const check = await this.jadwalRepo.findOne({
      where: {
        id,
      },
    });

    if (!check)
      throw new NotFoundException(`jadwal dengan id ${id} tidak ditemukan`);
    await this.jadwalRepo.delete(id);
    return {
      status: `Success `,
      message: 'Berhasil menghapus jadwal',
    };
  }

  async updateJadwal(
    id: number,
    updateJadwal: UpdateJadwalDto,
  ): Promise<ResponseSuccess> {
    const check = await this.jadwalRepo.findOne({
      where: {
        id,
      },
    });

    if (!check)
      throw new NotFoundException(`jadwal dengan id ${id} tidak ditemukan`);

    const update = await this.jadwalRepo.save({ ...updateJadwal, id: id });
    return {
      status: `Success `,
      message: 'jadwal berhasil di update',
      data: update,
    };
  }
}
