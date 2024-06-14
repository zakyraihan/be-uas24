import { Test, TestingModule } from '@nestjs/testing';
import { RuanganController } from './ruangan.controller';

describe('RuanganController', () => {
  let controller: RuanganController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RuanganController],
    }).compile();

    controller = module.get<RuanganController>(RuanganController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
