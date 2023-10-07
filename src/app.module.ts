import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SuplierModule } from './suplier/suplier.module';
import { HomeModule } from './home/home.module';
import { PrismaModule } from './prisma/prisma.module';
import { AdminModule } from './admin/admin.module';
import { PengajuanModule } from './pengajuan/pengajuan.module';
import { PengadaanModule } from './pengadaan/pengadaan.module';

@Module({
  imports: [SuplierModule, HomeModule, PrismaModule, AdminModule, PengajuanModule, PengadaanModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
