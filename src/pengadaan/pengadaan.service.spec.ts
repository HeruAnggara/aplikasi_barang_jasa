import { Test, TestingModule } from '@nestjs/testing';
import { PengadaanService } from './pengadaan.service';

describe('PengadaanService', () => {
  let service: PengadaanService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PengadaanService],
    }).compile();

    service = module.get<PengadaanService>(PengadaanService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
