import { Test, TestingModule } from '@nestjs/testing';
import { RuanganService } from './ruangan.service';

describe('RuanganService', () => {
  let service: RuanganService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RuanganService],
    }).compile();

    service = module.get<RuanganService>(RuanganService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
