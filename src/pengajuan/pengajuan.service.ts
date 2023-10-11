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

    /**
     * Terima Pengajuan
     * 
     * @param adminId 
     * @param idPengajuan 
     * @param data
     * @returns 
     */
    async terimaPengajuan(adminId: number, idPengajuan: number) {
        try {
            const checkUser = await this.prisma.admin.findUnique({
                where: {
                    id: adminId
                }
            });

            if(!checkUser) {
                throw new HttpException('Bad Request', HttpStatus.NOT_FOUND)
            }

            await this.prisma.pengajuan.update({
                where: {
                    id: idPengajuan
                },
                data: {
                    status:{
                        set: 2
                    }
                }
            })
            return {
                statusCode: HttpStatus.OK,
                message: 'Data pengajuan diterima'
            }
        } catch (error) {
            console.log(error);
            
            return {
                statusCode: HttpStatus.BAD_REQUEST,
                message: error.message
            }
        }
    }

    /**
     * Tolak Pengajuan
     * 
     * @param adminId 
     * @param idPengajuan 
     * @returns 
     */
    async tolakPengajuan(adminId: number, idPengajuan: number) {
        try {
            const checkUser = await this.prisma.admin.findUnique({
                where: {
                    id: adminId
                }
            });

            if(!checkUser) {
                throw new HttpException('Bad Request', HttpStatus.NOT_FOUND)
            }

            await this.prisma.pengajuan.update({
                where: {
                    id: idPengajuan
                },
                data: {
                    status:{
                        set: 0
                    }
                }
            })
            return {
                statusCode: HttpStatus.OK,
                message: 'Data pengajuan ditolak'
            }
        } catch (error) {
            console.log(error);
            
            return {
                statusCode: HttpStatus.BAD_REQUEST,
                message: error.message
            }
        }
    }

    /**
     * riwayat pengajuan
     * 
     * @param supplierId 
     * @returns 
     */
    async riwayatPengajuan(supplierId: number) {
        try {
            const checkUser = await this.prisma.supplier.findUnique({
                where: {
                    id: supplierId
                }
            });

            if(!checkUser) {
                throw new HttpException('Bad Request', HttpStatus.NOT_FOUND)
            }

            const riwayat = [];
            const pengajuan = await this.prisma.pengajuan.findMany({
                where: {
                    id_supplier: checkUser.id
                }
            })

            for (let x = 0; x < pengajuan.length; x++) {
                const idPengajuan = pengajuan[x].id;
                const idPengadaan = pengajuan[x].id_pengadaan;
                const idSupplier = pengajuan[x].id_supplier;
                const proposal = pengajuan[x].proposal;
                const anggaranPengajuan = pengajuan[x].anggaran;
                const statusPengajuan = pengajuan[x].status;
                const pengadaan = await this.prisma.pengadaan.findFirst({
                    where: {
                        id: idPengadaan
                    }
                })

                const supplier = await this.prisma.supplier.findFirst({
                    where: {
                        id: idSupplier
                    }
                })

                 riwayat.push ({
                    'idPengajuan':  idPengajuan,
                    'namaPengadaan': pengadaan.nama_pengadaan,
                    'gambar': pengadaan.gambar,
                    'anggaran': pengadaan.anggaran,
                    'proposal': proposal,
                    'anggaranPengajuan': anggaranPengajuan,
                    'statusPengajuan': statusPengajuan,
                    'namaSupplier': supplier.nama_usaha,
                    'emailSupplier': supplier.email,
                    'alamatSupplier': supplier.alamat
                })
            }
            return {
                statusCode: HttpStatus.OK,
                message: 'Data riwayat pengajuan supplier',
                data: riwayat
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
