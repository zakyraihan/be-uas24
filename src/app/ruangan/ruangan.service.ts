import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import BaseResponse from 'src/utils/response/base.response';
import { Ruangan } from './ruangan.entity';
import { Like, Repository } from 'typeorm';
import { CreateRuanganDto, findAllRuangan } from './ruangan.dto';
import { ResponsePagination, ResponseSuccess } from 'src/interface/response';
import { findAllJurusan } from '../jurusan/jurusan.dto';

@Injectable()
export class RuanganService extends BaseResponse {
  constructor(
    @InjectRepository(Ruangan)
    private readonly kategoriRepository: Repository<Ruangan>,
  ) {
    super();
  }

  async create(payload: CreateRuanganDto): Promise<ResponseSuccess> {
    try {
      await this.kategoriRepository.save({
        ...payload,
      });

      return this._success('OK');
    } catch (e) {
      console.log(`error ${e}`);
      throw new HttpException('Ada Kesalahan', HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }

  async getAllRuangan(query: findAllRuangan): Promise<ResponsePagination> {
    const { page, pageSize, limit, nama_ruangan } = query;

    const filterQuery: any = {};
    if (nama_ruangan) {
      filterQuery.nama_ruangan = Like(`%${nama_ruangan}%`);
    }
    const total = await this.kategoriRepository.count({
      where: filterQuery,
    });
    const result = await this.kategoriRepository.find({
      where: filterQuery,
      select: {
        // pilih data mana saja yang akan ditampilkan dari tabel kategori
        id: true,
        nama_ruangan: true,
        kapasitas_ruangan: true,
        gambar_ruangan: true,
        created_at: true,
        updated_at: true,
      },
      skip: limit,
      take: pageSize,
    });

    return this._pagination('OK', result, total, page, pageSize);
  }
}
