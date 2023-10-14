import { HttpCode, HttpException, HttpStatus, Injectable, ParseIntPipe } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PengajuannDto } from './dto/tambahPengajuan.dto';
import { LaporanDto } from './dto/tambahLaporan.dto';
import * as fs from 'fs';

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
     * selesai pengajuan
     * 
     * @param adminId 
     * @param idPengajuan 
     * @returns 
     */
    async selesaiPengajuan(adminId: number, idPengajuan: number) {
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
                        set: 3
                    }
                }
            })
            return {
                statusCode: HttpStatus.OK,
                message: 'Data pengajuan selesai'
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

    /**
     * tambah laporan
     * 
     * @param supplierId 
     * @param data 
     * @returns 
     */
    async tambahLaporan(supplierId: number, data: LaporanDto) {
        try {
            const supplier = await this.prisma.supplier.findFirst({
                where:{
                    id: supplierId
                }
            })

            if(!supplier) {
                throw new HttpException('Bad Request', HttpStatus.NOT_FOUND);
            }

            const idPengajuan = parseInt(data.id_pengajuan); 

            await this.prisma.laporan.create({
                data: {
                    id_pengajuan: idPengajuan,
                    id_supplier: supplierId,
                    laporan: data.laporan
                }
            })

            return {
                statusCode: HttpStatus.CREATED,
                message: "Data laporan berhasil ditambahkan"
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
     * pengajuan masuk
     * 
     * @param adminId 
     * @returns 
     */
    async pengajuanMasuk(adminId: number) {
        try {
            const checkUser = await this.prisma.admin.findUnique({
                where: {
                    id: adminId
                }
            });

            if(!checkUser) {
                throw new HttpException('Bad Request', HttpStatus.NOT_FOUND)
            }

            const data = [];
            const pengajuan = await this.prisma.pengajuan.findMany({
                where: {
                    status: 1
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

                const laporan = await this.prisma.laporan.findFirst({
                    where: {
                        id_pengajuan: idPengajuan
                    }
                })

                 data.push ({
                    'idPengajuan':  idPengajuan,
                    'namaPengadaan': pengadaan.nama_pengadaan,
                    'gambar': pengadaan.gambar,
                    'anggaran': pengadaan.anggaran,
                    'proposal': proposal,
                    'anggaranPengajuan': anggaranPengajuan,
                    'statusPengajuan': statusPengajuan,
                    'namaSupplier': supplier.nama_usaha,
                    'emailSupplier': supplier.email,
                    'alamatSupplier': supplier.alamat,
                    'laporan': laporan.laporan
                })
            }
            return {
                statusCode: HttpStatus.OK,
                message: 'Data riwayat pengajuan supplier',
                data: data
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
     * riwayat pengakuan selesai
     * 
     * @param supplierId 
     * @returns 
     */
    async riwayatPengajuanSelesai(supplierId: number) {
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
                    id_supplier: checkUser.id,
                    status: 3
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

    /**
     * tolak laporan
     * 
     * @param adminId 
     * @param idLaporan 
     * @returns 
     */
    async tolakLaporan(adminId: number, idLaporan: number) {
        try {
            const checkUser = await this.prisma.admin.findFirst({
                where: {
                    id: adminId
                }
            })

            const laporan = await this.prisma.laporan.findUnique({
                where: {
                  id: idLaporan,
                },
            });

            if(!checkUser && !laporan) {
                throw new HttpException('Bad Request', HttpStatus.NOT_FOUND);
            }

            const filePath = `public${laporan.laporan}`;
        
            await fs.promises.unlink(filePath);
            await this.prisma.laporan.update({
                where: {
                    id: idLaporan
                },
                data: {
                    laporan: "-"
                  },
            })

            return {
                statusCode: HttpStatus.OK,
                message: "Pengajuan laporan telah ditolak"
            }
            
        } catch (error) {
            return {
                statusCode: HttpStatus.BAD_REQUEST,
                message: `Gagal menolak laporan: ${error.message}`
            }    
        }
    }
}
