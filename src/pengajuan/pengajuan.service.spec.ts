import { Test, TestingModule } from '@nestjs/testing';
import { PengajuanService } from './pengajuan.service';

describe('PengajuanService', () => {
  let service: PengajuanService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PengajuanService],
    }).compile();

    service = module.get<PengajuanService>(PengajuanService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
