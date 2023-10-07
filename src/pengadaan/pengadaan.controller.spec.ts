import { Test, TestingModule } from '@nestjs/testing';
import { PengadaanController } from './pengadaan.controller';

describe('PengadaanController', () => {
  let controller: PengadaanController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PengadaanController],
    }).compile();

    controller = module.get<PengadaanController>(PengadaanController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
