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
import { DiskusiService } from './diskusi.service';
import { InjectCreatedBy } from 'src/utils/decorator/inject-created_by.decorator';
import {
  CreateDiskusiDto,
  UpdateDiskusiDto,
  findAllDiskusi,
} from './diskusi.dto';
import { JwtGuard } from '../auth/auth.guard';
import { Pagination } from 'src/utils/decorator/pagination-decorator';

@UseGuards(JwtGuard)
@Controller('diskusi')
export class DiskusiController {
  constructor(private diskusiService: DiskusiService) {}

  @Post('create')
  async create(@InjectCreatedBy() payload: CreateDiskusiDto) {
    return this.diskusiService.create(payload);
  }

  @Get('list')
  async getAllCategory(@Pagination() query: findAllDiskusi) {
    return this.diskusiService.getAllDiskusi(query);
  }

  @Delete('delete/:id')
  deleteBook(@Param('id') id: string) {
    return this.diskusiService.deleteDiskusi(+id);
  }

  @Put('update/:id')
  updateBook(@Param('id') id: string, @Body() updateDiskusi: UpdateDiskusiDto) {
    return this.diskusiService.updateBook(Number(id), updateDiskusi);
  }
}
