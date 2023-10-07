import { Module } from '@nestjs/common';
import { PengadaanService } from './pengadaan.service';
import { PengadaanController } from './pengadaan.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PengadaanController],
  providers: [PengadaanService]
})
export class PengadaanModule {}
