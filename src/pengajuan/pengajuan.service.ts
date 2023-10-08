import { HttpCode, HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
    async tambahPengajuan(supplierId: number, data: PengajuannDto, proposal) {
        try {
            const supplier = await this.prisma.supplier.findFirst({
                where:{
                    id: supplierId
                }
            })

            if(!supplier) {
                throw new HttpException('Bad Request', HttpStatus.NOT_FOUND);
            }

            await this.prisma.pengajuan.create({
                data: {
                    id_pengadaan: data.id_pengadaan,
                    id_supplier: supplierId,
                    proposal: proposal,
                    anggaran: data.anggaran
                }
            })

            return {
                statusCode: HttpStatus.CREATED,
                message: "Data pengajuan berhasil ditambahkan"
            }
        } catch (error) {
            return {
                statusCode: HttpStatus.BAD_REQUEST,
                message: error.message
            }
        }
    }
}
