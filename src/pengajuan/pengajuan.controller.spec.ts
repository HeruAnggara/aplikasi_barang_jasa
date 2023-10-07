import { Test, TestingModule } from '@nestjs/testing';
import { PengajuanController } from './pengajuan.controller';

describe('PengajuanController', () => {
  let controller: PengajuanController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PengajuanController],
    }).compile();

    controller = module.get<PengajuanController>(PengajuanController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
