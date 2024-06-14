import { Test, TestingModule } from '@nestjs/testing';
import { JadwalKuliahService } from './jadwal-kuliah.service';

describe('JadwalKuliahService', () => {
  let service: JadwalKuliahService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JadwalKuliahService],
    }).compile();

    service = module.get<JadwalKuliahService>(JadwalKuliahService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
