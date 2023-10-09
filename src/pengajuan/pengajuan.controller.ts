import { Body, Controller, Param, ParseIntPipe, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { PengajuanService } from './pengajuan.service';
import { AuthGuard } from 'src/admin/admin.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { PengajuannDto } from './dto/tambahPengajuan.dto';

@Controller('pengajuan')
export class PengajuanController {
    constructor(private pengajuan: PengajuanService){}

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

}
