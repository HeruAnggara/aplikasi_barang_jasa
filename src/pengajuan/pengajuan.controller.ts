import { BadRequestException, Body, Controller, Delete, FileTypeValidator, Get, MaxFileSizeValidator, Param, ParseFilePipe, ParseIntPipe, Patch, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
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
    async riwayatPengajuan(@Param('supplierId', ParseIntPipe)supplierId: number, @Req() req
    ) {
    const {id} = req.user
      return await this.pengajuan.riwayatPengajuan(supplierId, id)
    }
    @Get(':supplierId/riwayat/selesai')
    @UseGuards(AuthGuard)
    async riwayatPengajuanSelesai(@Param('supplierId', ParseIntPipe)supplierId: number,@Req() req
    ) {
    const {id} = req.user
      return await this.pengajuan.riwayatPengajuanSelesai(supplierId, id)
    }
    
    @Get(':adminId/laporan_pengajuan')
    @UseGuards(AuthGuard)
    async pengajuanMasuk(@Param('adminId', ParseIntPipe)adminId: number, @Req() req
    ) {
    const {id} = req.user
      return await this.pengajuan.pengajuanMasuk(adminId, id)
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
    async tambahPengajuan(
      @Param('supplierId', ParseIntPipe) supplierId: number, 
      @Body() data: PengajuannDto, 
      @UploadedFile(new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 2000000 }),
          new FileTypeValidator({ fileType: 'application/pdf' }),
        ],
      })) file: Express.Multer.File,
      @Req() req
    ) {
      const {id} = req.user;
      data.proposal = '/uploads/proposal/' + file.filename;
      return await this.pengajuan.tambahPengajuan(supplierId, data, id);
    }
    
    @Post(':supplierId/laporan')
    @UseGuards(AuthGuard)
    @UseInterceptors(
        FileInterceptor('laporan', {
          storage: diskStorage({
            destination: 'public/uploads/laporan',
            filename: (req, file, cb) => {
              cb(null, file.originalname);
            },
          }),
        }),
      )
    async tambahLaporan(
      @Param('supplierId', ParseIntPipe) supplierId: number, 
      @Body() data: LaporanDto, 
      @UploadedFile(new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 2000000 }),
          new FileTypeValidator({ fileType: 'application/pdf' }),
        ],
      })) file: Express.Multer.File,
      @Req() req
    ) {
      const {id} = req.user
      data.laporan = '/uploads/laporan/' + file.filename;
      return await this.pengajuan.tambahLaporan(supplierId, data, id);
    }

    @Patch(':adminId/:idPengajuan/terima')
    @UseGuards(AuthGuard)
    async terimaPengajuan(@Param('adminId', ParseIntPipe)adminId: number, @Param('idPengajuan', ParseIntPipe)idPengajuan: number, @Req() req
    ) {
      const {id} = req.user
      return await this.pengajuan.terimaPengajuan(adminId, idPengajuan, id)
    }

    @Patch(':adminId/:idPengajuan/tolak')
    @UseGuards(AuthGuard)
    async tolakPengajuan(@Param('adminId', ParseIntPipe)adminId: number, @Param('idPengajuan', ParseIntPipe)idPengajuan: number, @Req() req
    ) {
      const {id} = req.user
      return await this.pengajuan.tolakPengajuan(adminId, idPengajuan, id)
    }
    
    @Patch(':adminId/:idPengajuan/selesai')
    @UseGuards(AuthGuard)
    async selesaiPengajuan(@Param('adminId', ParseIntPipe)adminId: number, @Param('idPengajuan', ParseIntPipe)idPengajuan: number, @Req() req
    ) {
      const {id} = req.user
      return await this.pengajuan.selesaiPengajuan(adminId, idPengajuan, id)
    }

    @Delete(':adminId/:idLaporan/laporan')
    @UseGuards(AuthGuard)
    async tolakLaporan(
      @Param('adminId', ParseIntPipe) adminId: number,
      @Param('idLaporan', ParseIntPipe) idLaporan: number,
      @Req() req
    ) {
        const {id} = req.user
        return await this.pengajuan.tolakLaporan(adminId, idLaporan, id);
    }
}
