import { HttpCode, HttpException, HttpStatus, Injectable, ParseIntPipe } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PengajuannDto } from './dto/tambahPengajuan.dto';

@Injectable()
export class PengajuanService {
    constructor(private prisma: PrismaService){}

    /**
     * Tambah Data Pengajuan
     * 
     * @param supplierId 
     * @param data 
     * @param file 
     * @returns 
     */
    async tambahPengajuan(supplierId: number, data: PengajuannDto) {
        try {
            const supplier = await this.prisma.supplier.findFirst({
                where:{
                    id: supplierId
                }
            })

            if(!supplier) {
                throw new HttpException('Bad Request', HttpStatus.NOT_FOUND);
            }

            const idPengadaan = parseInt(data.id_pengadaan); 

            await this.prisma.pengajuan.create({
                data: {
                    id_pengadaan: idPengadaan,
                    id_supplier: supplierId,
                    proposal: data.proposal,
                    anggaran: data.anggaran
                }
            })

            return {
                statusCode: HttpStatus.CREATED,
                message: "Data pengajuan berhasil ditambahkan"
            }
        } catch (error) {
            console.log(error);
            
            return {
                statusCode: HttpStatus.BAD_REQUEST,
                message: error.message
            }
        }
    }
}
