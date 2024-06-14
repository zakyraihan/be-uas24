import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import BaseResponse from 'src/utils/response/base.response';
import { Mahasiswa } from './mahasiswa.entity';
import { Like, Repository } from 'typeorm';
import {
  CreateMahasiswaArrayDto,
  UpdateMahasiswaDto,
  findAllMahasiswa,
} from './mahasiswa.dto';
import { ResponsePagination, ResponseSuccess } from 'src/interface/response';
import { Jurusan } from '../jurusan/jurusan.entity';

@Injectable()
export class MahasiswaService extends BaseResponse {
  constructor(
    @InjectRepository(Mahasiswa)
    private readonly mahasiswaRepo: Repository<Mahasiswa>,
    @InjectRepository(Jurusan)
    private readonly jurusanRepo: Repository<Jurusan>,
  ) {
    super();
  }

  async createBulk(payload: CreateMahasiswaArrayDto): Promise<ResponseSuccess> {
    try {
      let berhasil = 0;
      let gagal = 0;

      await Promise.all(
        payload.data.map(async (item) => {
          try {
            // Ambil data jurusan dari database berdasarkan ID
            const jurusan = await this.jurusanRepo.findOne({
              where: {
                id: item.jurusan_id,
              },
            });

            if (jurusan) {
              // Tambahkan peminat_jurusan dengan 1
              jurusan.peminat_jurusan += 1;
              await this.jurusanRepo.save(jurusan);
            }

            // Buat objek mahasiswa dengan tambahan jurusan dan ruangan
            const dataSave = {
              ...item,
              jurusan: {
                id: item.jurusan_id,
                peminat_jurusan: jurusan ? jurusan.peminat_jurusan : 0,
              },
              ruangan: {
                id: item.ruangan_id,
              },
            };

            // Simpan data mahasiswa ke database
            await this.mahasiswaRepo.save(dataSave);
            berhasil += 1;
          } catch (error) {
            console.log('error', error);
            gagal += 1;
          }
        }),
      );

      return this._success(`berhasil menyimpan ${berhasil} dan gagal ${gagal}`);
    } catch (error) {
      console.log('error', error);
      throw new HttpException('ada kesalahan', HttpStatus.BAD_REQUEST);
    }
  }

  async findAll(query: findAllMahasiswa): Promise<ResponsePagination> {
    const { page, pageSize, limit, nama_mahasiswa } = query;
    console.log(query);
    console.log('limit', limit);

    const filterQuery: any = {};
    const filterKeyword: any = {};
    if (nama_mahasiswa) {
      filterQuery.nama_mahasiswa = Like(`%${nama_mahasiswa}%`);
    }

    const total = await this.mahasiswaRepo.count();
    const result = await this.mahasiswaRepo.find({
      where: filterQuery,
      relations: ['jurusan', 'ruangan'], // Include related entities
      select: {
        id: true,
        foto_mahasiswa: true,
        nama_mahasiswa: true,
        alamat: true,
        asal: true,
        nama_ortu: true,
        tanggal_lahir: true,
        umur: true,
        nim: true,
        jurusan: {
          id: true,
          nama_jurusan: true,
        },
        ruangan: {
          id: true,
          nama_ruangan: true,
        },
      },
      skip: limit,
      take: pageSize,
    });

    return this._pagination('OK', result, total, page, pageSize);
  }

  async getDetail(id: number): Promise<ResponseSuccess> {
    const detailJurusan = await this.mahasiswaRepo.findOne({
      where: {
        id,
      },
      relations: ['jurusan', 'ruangan'],
      select: {
        id: true,
        foto_mahasiswa: true,
        nama_mahasiswa: true,
        alamat: true,
        asal: true,
        nama_ortu: true,
        tanggal_lahir: true,
        umur: true,
        nim: true,
        jurusan: {
          id: true,
          nama_jurusan: true,
        },
        ruangan: {
          id: true,
          nama_ruangan: true,
        },
      },
    });

    if (!detailJurusan) {
      throw new NotFoundException(`mahasiswa dengan id ${id} tidak ditemukan`);
    }
    return this._success('berhasil menemukan detail produk', detailJurusan);
  }

  async update(
    id: number,
    payload: UpdateMahasiswaDto,
  ): Promise<ResponseSuccess> {
    const check = await this.mahasiswaRepo.findOne({
      where: {
        id: id,
      },
    });

    if (!check) {
      throw new HttpException(
        'mahasiswa tidak ditemukan',
        HttpStatus.NOT_FOUND,
      );
    }

    // Object.assign(check, payload);
    const updateMahasiswa = await this.mahasiswaRepo.save({
      ...payload,
      id: id,
    });
    return this._success('Berhasil mengupdate mahasiswa', updateMahasiswa);
  }

  async deleteMahasiswa(id: number): Promise<ResponseSuccess> {
    const check = await this.mahasiswaRepo.findOne({
      where: {
        id,
      },
    });

    if (!check)
      throw new NotFoundException(`mahasiswa dengan id ${id} tidak ditemukan`);
    await this.mahasiswaRepo.delete(id);
    return {
      status: `Success `,
      message: 'Berhasil menghapus mahasiswa',
    };
  }
}
