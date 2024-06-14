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
import { JadwalKuliahService } from './jadwal-kuliah.service';
import { InjectCreatedBy } from 'src/utils/decorator/inject-created_by.decorator';
import {
  CreateJadwalDto,
  UpdateJadwalDto,
  findAllJadwal,
} from './jadwal-kuliah.dto';
import { JwtGuard } from '../auth/auth.guard';
import { Pagination } from 'src/utils/decorator/pagination-decorator';

@UseGuards(JwtGuard)
@Controller('jadwal-kuliah')
export class JadwalKuliahController {
  constructor(private jadwalKuliahService: JadwalKuliahService) {}

  @Post('create')
  async create(@InjectCreatedBy() payload: CreateJadwalDto) {
    return this.jadwalKuliahService.create(payload);
  }

  @Get('list')
  async getAllCategory(@Pagination() query: findAllJadwal) {
    return this.jadwalKuliahService.getAllJadwal(query);
  }

  @Delete('delete/:id')
  deleteBook(@Param('id') id: string) {
    return this.jadwalKuliahService.deleteJadwal(+id);
  }

  @Put('update/:id')
  updateBook(@Param('id') id: string, @Body() updateJadwal: UpdateJadwalDto) {
    return this.jadwalKuliahService.updateJadwal(Number(id), updateJadwal);
  }
}
