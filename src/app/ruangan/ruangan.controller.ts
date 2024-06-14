import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { RuanganService } from './ruangan.service';
import { CreateRuanganDto, findAllRuangan } from './ruangan.dto';
import { Pagination } from 'src/utils/decorator/pagination-decorator';
import { JwtGuard } from '../auth/auth.guard';

@UseGuards(JwtGuard)
@Controller('ruangan')
export class RuanganController {
  constructor(private ruanganService: RuanganService) {}

  @Post('create')
  async create(@Body() payload: CreateRuanganDto) {
    return this.ruanganService.create(payload);
  }

  @Get('list')
  async getAllCategory(@Pagination() query: findAllRuangan) {
    return this.ruanganService.getAllRuangan(query);
  }
}
