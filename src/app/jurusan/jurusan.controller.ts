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
import { JwtGuard } from '../auth/auth.guard';
import { JurusanService } from './jurusan.service';
import { Pagination } from 'src/utils/decorator/pagination-decorator';
import {
  CreateJurusanDto,
  UpdateJurusanDto,
  findAllJurusan,
} from './jurusan.dto';

@UseGuards(JwtGuard) //  implementasikan global guard pada semua endpont kategori memerlukan authentikasi saat request
@Controller('jurusan')
export class JurusanController {
  constructor(private jurusanService: JurusanService) {}

  @Post('create')
  async create(@Body() payload: CreateJurusanDto) {
    return this.jurusanService.create(payload);
  }

  @Get('list')
  async getAllCategory(@Pagination() query: findAllJurusan) {
    return this.jurusanService.getAllCategory(query);
  }

  @Delete('delete/:id')
  async Hapus(@Param('id') id: string) {
    return this.jurusanService.delete(+id);
  }

  @Put('update/:id')
  updateBook(@Param('id') id: string, @Body() updateBookDto: UpdateJurusanDto) {
    return this.jurusanService.updateJurusan(Number(id), updateBookDto);
  }

  @Get('detail/:id')
  findOneJurusan(@Param('id') id: string) {
    return this.jurusanService.getDetail(Number(id));
  }
}
