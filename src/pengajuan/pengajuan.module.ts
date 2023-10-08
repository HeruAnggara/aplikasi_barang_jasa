import { Module } from '@nestjs/common';
import { PengajuanController } from './pengajuan.controller';
import { PengajuanService } from './pengajuan.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PengajuanController],
  providers: [PengajuanService]
})
export class PengajuanModule {}
