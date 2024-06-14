import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import BaseResponse from 'src/utils/response/base.response';
import { Jurusan } from './jurusan.entity';
import { Like, Repository } from 'typeorm';
import {
  CreateJurusanDto,
  UpdateJurusanDto,
  findAllJurusan,
} from './jurusan.dto';
import { ResponsePagination, ResponseSuccess } from 'src/interface/response';

@Injectable()
export class JurusanService extends BaseResponse {
  constructor(
    @InjectRepository(Jurusan)
    private readonly jurusanRepo: Repository<Jurusan>,
  ) {
    super();
  }

  async create(payload: CreateJurusanDto): Promise<ResponseSuccess> {
    try {
      await this.jurusanRepo.save({
        ...payload,
      });

      return this._success('OK');
    } catch (e) {
      console.log(`error ${e}`);
      throw new HttpException('Ada Kesalahan', HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }

  async getAllCategory(query: findAllJurusan): Promise<ResponsePagination> {
    const { page, pageSize, limit, nama_jurusan } = query;

    const filterQuery: any = {};
    if (nama_jurusan) {
      filterQuery.nama_jurusan = Like(`%${nama_jurusan}%`);
    }
    const total = await this.jurusanRepo.count({
      where: filterQuery,
    });
    const result = await this.jurusanRepo.find({
      where: filterQuery,
      select: {
        // pilih data mana saja yang akan ditampilkan dari tabel kategori
        id: true,
        nama_jurusan: true,
        peminat_jurusan: true,
        // created_at: true,
        // updated_at: true,
      },
      skip: limit,
      take: pageSize,
    });

    return this._pagination('OK', result, total, page, pageSize);
  }

  async delete(id: number): Promise<ResponseSuccess> {
    const cek = await this.jurusanRepo.findOne({ where: { id: id } });

    if (!cek) {
      throw new HttpException('Terjadi Kesalahan', HttpStatus.BAD_REQUEST);
    }

    const hapus = await this.jurusanRepo.delete(id);

    return this._success('Berhasil Menghapus jurusan', hapus);
  }

  async updateJurusan(
    id: number,
    updateBookDto: UpdateJurusanDto,
  ): Promise<ResponseSuccess> {
    const check = await this.jurusanRepo.findOne({
      where: {
        id,
      },
    });

    if (!check)
      throw new NotFoundException(`Buku dengan id ${id} tidak ditemukan`);

    const update = await this.jurusanRepo.save({ ...updateBookDto, id: id });
    return {
      status: `Success `,
      message: 'jurusan berhasil di update',
      data: update,
    };
  }

  async getDetail(id: number): Promise<ResponseSuccess> {
    const detailJurusan = await this.jurusanRepo.findOne({
      where: {
        id,
      },
    });

    if (detailJurusan === null) {
      throw new NotFoundException(`jurusan dengan id ${id} tidak ditemukan`);
    }
    return {
      status: 'Success',
      message: 'Detail jurusan ditermukan',
      data: detailJurusan,
    };
  }
}
