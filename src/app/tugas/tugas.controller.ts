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
import { TugasService } from './tugas.service';
import { JwtGuard } from '../auth/auth.guard';
import { Pagination } from 'src/utils/decorator/pagination-decorator';
import {
  CreateTugasArrayDto,
  CreateTugasDto,
  UpdateTugasDto,
  UpdateTugasDtoMahasiswa,
  findAllTugas,
} from './tugas.dto';

@UseGuards(JwtGuard)
@Controller('tugas')
export class TugasController {
  constructor(private tugasService: TugasService) {}

  @Post('create')
  async createBulk(@Body() payload: CreateTugasDto) {
    return this.tugasService.createBulk(payload);
  }

  @Get('list')
  async findAll(@Pagination() query: findAllTugas) {
    // console.log(query)
    return this.tugasService.getAllTugas(query);
  }

  @Put('update/:id')
  updateBook(@Param('id') id: string, @Body() updateBookDto: UpdateTugasDto) {
    return this.tugasService.updateTugas(Number(id), updateBookDto);
  }

  @Put('updatebymahasiswa/:id')
  updateTugas(
    @Param('id') id: string,
    @Body() updateTugasDto: UpdateTugasDtoMahasiswa,
  ) {
    return this.tugasService.updateTugasMahasiswa(Number(id), updateTugasDto);
  }

  @Delete('delete/:id')
  deleteTugas(@Param('id') id: string) {
    return this.tugasService.deleteTugas(+id);
  }

  @Get('detail/:id')
  findOneTugas(@Param('id') id: string) {
    return this.tugasService.getDetail(Number(id));
  }
}
