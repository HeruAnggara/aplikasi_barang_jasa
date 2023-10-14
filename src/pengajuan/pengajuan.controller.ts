import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { PengajuanService } from './pengajuan.service';
import { AuthGuard } from 'src/admin/admin.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { PengajuannDto } from './dto/tambahPengajuan.dto';
import { LaporanDto } from './dto/tambahLaporan.dto';

@Controller('pengajuan')
export class PengajuanController {
    constructor(private pengajuan: PengajuanService){}

    @Get(':supplierId/riwayat')
    @UseGuards(AuthGuard)
    async riwayatPengajuan(@Param('supplierId', ParseIntPipe)supplierId: number, ){
      return await this.pengajuan.riwayatPengajuan(supplierId)
    }
    @Get(':supplierId/riwayat/selesai')
    @UseGuards(AuthGuard)
    async riwayatPengajuanSelesai(@Param('supplierId', ParseIntPipe)supplierId: number, ){
      return await this.pengajuan.riwayatPengajuanSelesai(supplierId)
    }
    
    @Get(':adminId/laporan_pengajuan')
    @UseGuards(AuthGuard)
    async pengajuanMasuk(@Param('adminId', ParseIntPipe)adminId: number, ){
      return await this.pengajuan.pengajuanMasuk(adminId)
    }

    @Post(':supplierId')
    @UseGuards(AuthGuard)
    @UseInterceptors(
        FileInterceptor('proposal', {
          storage: diskStorage({
            destination: 'public/uploads/proposal',
            filename: (req, file, cb) => {
              cb(null, file.originalname);
            },
          }),
        }),
      )
    async tambahPengajuan(@Param('supplierId', ParseIntPipe) supplierId: number, @Body() data: PengajuannDto, @UploadedFile() file: Express.Multer.File) {
      data.proposal = '/uploads/proposal/' + file.filename;
      return await this.pengajuan.tambahPengajuan(supplierId, data);
    }
    
    @Post(':supplierId/laporan')
    @UseGuards(AuthGuard)
    @UseInterceptors(
        FileInterceptor('laporan', {
          storage: diskStorage({
            destination: 'public/uploads/proposal',
            filename: (req, file, cb) => {
              cb(null, file.originalname);
            },
          }),
        }),
      )
    async tambahLaporan(@Param('supplierId', ParseIntPipe) supplierId: number, @Body() data: LaporanDto, @UploadedFile() file: Express.Multer.File) {
      data.laporan = '/uploads/laporan/' + file.filename;
      return await this.pengajuan.tambahLaporan(supplierId, data);
    }

    @Patch(':adminId/:idPengajuan/terima')
    @UseGuards(AuthGuard)
    async terimaPengajuan(@Param('adminId', ParseIntPipe)adminId: number, @Param('idPengajuan', ParseIntPipe)idPengajuan: number){
      return await this.pengajuan.terimaPengajuan(adminId, idPengajuan)
    }

    @Patch(':adminId/:idPengajuan/tolak')
    @UseGuards(AuthGuard)
    async tolakPengajuan(@Param('adminId', ParseIntPipe)adminId: number, @Param('idPengajuan', ParseIntPipe)idPengajuan: number){
      return await this.pengajuan.tolakPengajuan(adminId, idPengajuan)
    }
    
    @Patch(':adminId/:idPengajuan/selesai')
    @UseGuards(AuthGuard)
    async selesaiPengajuan(@Param('adminId', ParseIntPipe)adminId: number, @Param('idPengajuan', ParseIntPipe)idPengajuan: number){
      return await this.pengajuan.selesaiPengajuan(adminId, idPengajuan)
    }

}
