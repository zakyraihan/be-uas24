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
import { Tugas } from './tugas.entity';
import { Like, Repository } from 'typeorm';
import {
  CreateTugasArrayDto,
  CreateTugasDto,
  UpdateTugasDto,
  UpdateTugasDtoMahasiswa,
  findAllTugas,
} from './tugas.dto';
import { ResponsePagination, ResponseSuccess } from 'src/interface/response';
import { REQUEST } from '@nestjs/core';
import { UserKuliah } from '../auth/auth.entity';

@Injectable()
export class TugasService extends BaseResponse {
  constructor(
    @InjectRepository(Tugas)
    private readonly tugasRepo: Repository<Tugas>,
    @InjectRepository(UserKuliah)
    private readonly UserRepository: Repository<UserKuliah>,
    @Inject(REQUEST) private req: any,
  ) {
    super();
  }

  async createBulk(payload: CreateTugasDto): Promise<ResponseSuccess> {
    try {
      await this.tugasRepo.save({
        ...payload,
        jurusan: {
          id: payload.jurusan_id,
        },
      });

      return this._success(`berhasil menyimpan tugas`);
    } catch (error) {
      console.log('error', error);
      throw new HttpException('ada kesalahan', HttpStatus.BAD_REQUEST);
    }
  }

  async getAllTugas(query: findAllTugas): Promise<ResponsePagination> {
    const { page, pageSize, limit, title } = query;

    const filterQuery: any = {};
    if (title) {
      filterQuery.title = Like(`%${title}%`);
    }

    const total = await this.tugasRepo.count({ where: filterQuery });

    console.log('Qwery', filterQuery);

    const result = await this.tugasRepo.find({
      where: filterQuery,
      relations: ['jurusan', 'updated_by_mahasiswa'],
      order: { id: 'DESC' },
      select: {
        id: true,
        title: true,
        gambar: true,
        description: true,
        jumlah: true,
        status: true,
        jurusan: {
          id: true,
          nama_jurusan: true,
        },
        created_at: true,
        updated_by_mahasiswa: {
          id: true,
          nama: true,
        },
      },
      skip: limit,
      take: pageSize,
    });

    return this._pagination('Okeh', result, total, page, pageSize);
  }

  async deleteTugas(id: number): Promise<ResponseSuccess> {
    const check = await this.tugasRepo.findOne({
      where: {
        id,
      },
    });

    if (!check)
      throw new NotFoundException(`tugas dengan id ${id} tidak ditemukan`);
    await this.tugasRepo.delete(id);

    return {
      status: `Success `,
      message: 'Berhasil menghapus tugas',
    };
  }

  async updateTugas(
    id: number,
    updateTugasDto: UpdateTugasDto,
  ): Promise<ResponseSuccess> {
    const check = await this.tugasRepo.findOne({
      where: {
        id,
      },
    });

    if (!check)
      throw new NotFoundException(`tugas dengan id ${id} tidak ditemukan`);

    const update = await this.tugasRepo.save({
      ...updateTugasDto,
      id: id,
    });
    return {
      status: `Success `,
      message: 'tugas berhasil di update',
      data: update,
    };
  }
  async updateTugasMahasiswa(
    id: number,
    updateTugasDto: UpdateTugasDtoMahasiswa,
  ): Promise<ResponseSuccess> {
    const check = await this.tugasRepo.findOne({
      where: {
        id,
      },
      relations: ['updated_by_mahasiswa'],
    });

    // if (check.updated_by_mahasiswa.id !== this.req.user.id) {
    //   throw new ForbiddenException(
    //     `Anda tidak diizinkan untuk mengedit diskusi ini`,
    //   );
    // }

    if (!check)
      throw new NotFoundException(`tugas dengan id ${id} tidak ditemukan`);

    const update = await this.tugasRepo.save({
      ...updateTugasDto,
      id: id,
      updated_by_mahasiswa: {
        id: this.req.user.id,
      },
    });
    return {
      status: `Success `,
      message: 'tugas berhasil di update',
      data: update,
    };
  }

  async getDetail(id: number): Promise<ResponseSuccess> {
    const detailBook = await this.tugasRepo.findOne({
      where: {
        id,
      },
    });

    if (detailBook === null) {
      throw new NotFoundException(`tugas dengan id ${id} tidak ditemukan`);
    }
    return {
      status: 'Success',
      message: 'Detail tugas ditermukan',
      data: detailBook,
    };
  }
}
