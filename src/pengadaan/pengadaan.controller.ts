import { Body, Controller, Delete, FileTypeValidator, Get, MaxFileSizeValidator, Param, ParseFilePipe, ParseIntPipe, Patch, Post, Query, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from 'src/admin/admin.guard';
import { PengadaanService } from './pengadaan.service';
import { PengadaanDto } from './dto/pengadaan.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { UpdatePengadaanDto } from './dto/updatePengadaan.dto';

@Controller('pengadaan')
export class PengadaanController {
    constructor(private pengadaanService: PengadaanService){}

    @Get()
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
    async tambahPengadaan(
      @Param('adminId', ParseIntPipe) adminId: number, 
      @Body() data: PengadaanDto, 
      @UploadedFile(new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 2000000 }),
          new FileTypeValidator({ fileType: /image\/(jpeg|png|jpg)/ }),
        ],
      })) file: Express.Multer.File,
      @Req() req
        ) {
        const {id} = req.user 
        data.gambar = '/uploads/image/' + file.filename;
        return await this.pengadaanService.tambahPengadaan(adminId, data, id);
    }

    @Delete(':adminId/:idPengadaan/gambar')
    @UseGuards(AuthGuard)
    async deleteFile(
      @Param('adminId', ParseIntPipe) adminId: number,
      @Param('idPengadaan', ParseIntPipe) idPengadaan: number,
      @Req() req
        ) {
        const {id} = req.user 
        return await this.pengadaanService.deleteUploadedFile(adminId, idPengadaan, id);
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
      @UploadedFile(new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 2000000 }),
          new FileTypeValidator({ fileType: /image\/(jpeg|png|jpg)/ }),
        ],
      })) file: Express.Multer.File,
      @Req() req
      ) {
      const {id} = req.user 
        return await this.pengadaanService.updateFileGambar(adminId, idPengadaan, '/uploads/image/' + file.filename, id);
    }

    @Delete(':adminId/:idPengadaan')
    @UseGuards(AuthGuard)
    async deletePengadaan(
      @Param('adminId', ParseIntPipe) adminId: number, 
      @Param('idPengadaan', ParseIntPipe) idPengadaan: number,
      @Req() req
        ) {
        const {id} = req.user 
        return await this.pengadaanService.deletePengadaan(adminId, idPengadaan, id);
    }

    @Patch(':adminId/update/:idPengadaan')
    @UseGuards(AuthGuard)
    async updatePengadaan(
      @Param('adminId', ParseIntPipe) adminId: number,
      @Param('idPengadaan', ParseIntPipe) idPengadaan: number,
      @Body() data: UpdatePengadaanDto,
      @Req() req
    ) {
      const {id} = req.user 
      return await this.pengadaanService.updateDataPengadaan(adminId, idPengadaan, data, id);
    }

    @Get('/aktif')
    async listPengadaanAktif(@Query('keyword') keyword: any,
    @Query('page') page: number,
    @Query('limit') limit: number) {
      return await this.pengadaanService.listPengadaanAktif(keyword, page, limit);
    }
}
