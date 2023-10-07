import { Test, TestingModule } from '@nestjs/testing';
import { SuplierService } from './suplier.service';

describe('SuplierService', () => {
  let service: SuplierService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SuplierService],
    }).compile();

    service = module.get<SuplierService>(SuplierService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
