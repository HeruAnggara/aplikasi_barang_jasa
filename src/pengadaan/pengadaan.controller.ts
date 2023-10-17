import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from 'src/admin/admin.guard';
import { PengadaanService } from './pengadaan.service';
import { PengadaanDto } from './dto/pengadaan.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { UpdateGambarDto } from './dto/updateGambar.dto';
import { UpdatePengadaanDto } from './dto/updatePengadaan.dto';

@Controller('pengadaan')
export class PengadaanController {
    constructor(private pengadaanService: PengadaanService){}

    @Get()
    @UseGuards(AuthGuard)
    async listPengadaan(
      @Query('keyword') keyword: any,
      @Query('page') page: number,
      @Query('limit') limit: number,
    ) {        
        return await this.pengadaanService.listPengadaan(keyword, page, limit);
    }

    @Post(':adminId')
    @UseGuards(AuthGuard)
    @UseInterceptors(
        FileInterceptor('gambar', {
          storage: diskStorage({
            destination: 'public/uploads/image',
            filename: (req, file, cb) => {
              cb(null, file.originalname);
            },
          }),
        }),
      )
    async tambahPengadaan(@Param('adminId', ParseIntPipe) adminId: number, @Body() data: PengadaanDto, @UploadedFile() file: Express.Multer.File){
        return await this.pengadaanService.tambahPengadaan(adminId, data, '/uploads/image/' + file.filename,);
    }

    @Delete(':adminId/:idPengadaan/gambar')
    @UseGuards(AuthGuard)
    async deleteFile(
      @Param('adminId', ParseIntPipe) adminId: number,
      @Param('idPengadaan', ParseIntPipe) idPengadaan: number
      ) {
        return await this.pengadaanService.deleteUploadedFile(adminId, idPengadaan);
    }

    @Patch(':adminId/update/:idPengadaan/gambar')
    @UseGuards(AuthGuard)
    @UseInterceptors(
        FileInterceptor('gambar', {
          storage: diskStorage({
            destination: 'public/uploads/image',
            filename: (req, file, cb) => {
              cb(null, file.originalname);
            },
          }),
        }),
      )
    async updateGambar(
      @Param('adminId', ParseIntPipe) adminId: number, 
      @Param('idPengadaan', ParseIntPipe) idPengadaan: number,
      @UploadedFile() file: Express.Multer.File){
        const data: UpdateGambarDto = {
          gambar: '/uploads/image/' + file.filename, // Mengambil nama file gambar dari file yang diunggah
        };
        return await this.pengadaanService.updateFileGambar(adminId, idPengadaan, data);
    }

    @Delete(':adminId/:idPengadaan')
    @UseGuards(AuthGuard)
    async deletePengadaan(
      @Param('adminId', ParseIntPipe) adminId: number, 
      @Param('idPengadaan', ParseIntPipe) idPengadaan: number
      ) {
        return await this.pengadaanService.deletePengadaan(adminId, idPengadaan);
    }

    @Patch(':adminId/update/:idPengadaan')
    @UseGuards(AuthGuard)
    async updatePengadaan(
      @Param('adminId', ParseIntPipe) adminId: number,
      @Param('idPengadaan', ParseIntPipe) idPengadaan: number,
      @Body() data: UpdatePengadaanDto
    ) {
      return await this.pengadaanService.updateDataPengadaan(adminId, idPengadaan, data);
    }

    @Get('/aktif')
    @UseGuards(AuthGuard)
    async listPengadaanAktif() {
      return await this.pengadaanService.listPengadaanAktif();
    }
}
