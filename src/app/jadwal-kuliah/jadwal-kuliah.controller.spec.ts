import { Test, TestingModule } from '@nestjs/testing';
import { JadwalKuliahController } from './jadwal-kuliah.controller';

describe('JadwalKuliahController', () => {
  let controller: JadwalKuliahController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JadwalKuliahController],
    }).compile();

    controller = module.get<JadwalKuliahController>(JadwalKuliahController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
