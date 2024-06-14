import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { MahasiswaService } from './mahasiswa.service';
import { JwtGuard } from '../auth/auth.guard';
import {
  CreateMahasiswaArrayDto,
  UpdateMahasiswaDto,
  findAllMahasiswa,
} from './mahasiswa.dto';
import { Pagination } from 'src/utils/decorator/pagination-decorator';

@UseGuards(JwtGuard)
@Controller('mahasiswa')
export class MahasiswaController {
  constructor(private mahasiswaService: MahasiswaService) {}

  @Post('create-bulk')
  async createBulk(@Body() payload: CreateMahasiswaArrayDto) {
    return this.mahasiswaService.createBulk(payload);
  }

  @Get('list')
  async findAll(@Pagination() query: findAllMahasiswa) {
    // console.log(query)
    return this.mahasiswaService.findAll(query);
  }

  @Get('detail/:id')
  findOneJurusan(@Param('id') id: string) {
    return this.mahasiswaService.getDetail(Number(id));
  }

  @Put('update/:id')
  async updateProduk(
    @Param('id') id: number,
    @Body() payload: UpdateMahasiswaDto,
  ) {
    return this.mahasiswaService.update(id, payload);
  }

  @Delete('delete/:id')
  deleteBook(@Param('id') id: string) {
    return this.mahasiswaService.deleteMahasiswa(+id);
  }
}
