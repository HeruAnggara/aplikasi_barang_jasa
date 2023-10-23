import {  HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PengadaanDto } from './dto/pengadaan.dto';
import * as fs from 'fs';
import { UpdatePengadaanDto } from './dto/updatePengadaan.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class PengadaanService {
    constructor(private prisma: PrismaService){}

    /**
     * List Pengadaan
     */
    async listPengadaan(keyword: any, page: number = 1, limit: number = 10) {
        try {
            const skip = (page - 1) * limit;

            const where: Prisma.pengadaanWhereInput = keyword
            ? {
                OR: [
                {
                    nama_pengadaan: {
                    contains: keyword
                    },
                },
                ],
            }
            : {};

            const allPengadaan = await this.prisma.pengadaan.findMany({
                where,
                skip,
                take: limit,
            });

            const totalItems = await this.prisma.pengadaan.count({ where });
            
            return {
                statusCode: HttpStatus.OK,
                message: "Data list pengadaan",
                data: {
                    allPengadaan,
                    totalItems,
                    totalPages: Math.ceil(totalItems / limit),
                    currentPage: page
                }
            }
        } catch (error) {
            return {
                statusCode: HttpStatus.BAD_REQUEST,
                message: error
            }
        }
    }

    /**
     * Tambah Data Pengadaan
     * 
     * @param adminId 
     * @param idPengadaan 
     */
    async tambahPengadaan(adminId: number, data: PengadaanDto, id: number){
        try {
            const checkUser = await this.prisma.admin.findFirst({
            where: {
                id: adminId
            }
            })

            if(checkUser.id !== id) {
            throw new HttpException('Bad Request', HttpStatus.NOT_FOUND);
            }

            const tambahData = await this.prisma.pengadaan.create({
                data: {
                    nama_pengadaan: data.nama_pengadaan,
                    deskripsi: data.deskripsi,
                    anggaran: data.anggaran,
                    gambar: data.gambar
                }
            })

            return {
                statusCode: HttpStatus.OK,
                message: "Tambah Data Pengadaan",
                data: tambahData
            }

        } catch (error) {
            return {
                statusCode: HttpStatus.BAD_REQUEST,
                message: error.message
            }
        }
    }

    /**
     * Delete Gambar
     * 
     * @param filePath 
     */
    async deleteUploadedFile(adminId: number, idPengadaan: number, id: number) {
        try {
            const checkUser = await this.prisma.admin.findFirst({
                where: {
                    id: adminId
                }
            })

            const pengadaan = await this.prisma.pengadaan.findUnique({
                where: {
                  id: idPengadaan,
                },
            });

            if(checkUser.id !== id && !pengadaan) {
                throw new HttpException('Bad Request', HttpStatus.NOT_FOUND);
              }

            const filePath = `public/uploads/image/${pengadaan.gambar}`;
            // const filePath = `public${pengadaan.gambar}`;
        
            await fs.promises.unlink(filePath);
            await this.prisma.pengadaan.update({
                where: {
                    id: idPengadaan
                },
                data: {
                    gambar: "-"
                  },
            })

            return {
                statusCode: HttpStatus.OK,
                message: "Hapus Gambar Berhasil"
            }
            
        } catch (error) {
            return {
                statusCode: HttpStatus.BAD_REQUEST,
                message: `Gagal menghapus file: ${error.message}`
            }    
        }
    }

    /**
     * Update Gambar
     * 
     * @param adminId 
     * @param idPengadaan 
     * @request gambar
     */
    async updateFileGambar(adminId: number, idPengadaan: number, gambar, id: number){
        try {
            const checkUser = await this.prisma.admin.findFirst({
                where: {
                    id: adminId
                }
            })

            const pengadaan = await this.prisma.pengadaan.findUnique({
                where: {
                  id: idPengadaan,
                },
            });

            if(checkUser.id !== id) {
                throw new HttpException('Bad Request', HttpStatus.NOT_FOUND);
              }
        
            const filePath = `public/uploads/image/${pengadaan.gambar}`;
        
            await fs.promises.unlink(filePath);  
            
            await this.prisma.pengadaan.update({
                where: {
                    id: idPengadaan
                },
                data: {
                    gambar: gambar
                  },
            })

            return {
                statusCode: HttpStatus.OK,
                message: "Update Gambar Berhasil"
            }
            
        } catch (error) {
            return {
                statusCode: HttpStatus.BAD_REQUEST,
                message: `Gagal update file: ${error.message}`
            }    
        }
    } 

    /**
     * Hapus Data Pengadaan
     * 
     * @param adminId 
     * @param idPengadaan 
     * @returns 
     */
    async deletePengadaan(adminId: number, idPengadaan: number, id: number) {
        try {
            const checkUser = await this.prisma.admin.findFirst({
                where: {
                    id: adminId
                }
            })

            if(checkUser.id !== id) {
                throw new HttpException('Bad Request', HttpStatus.NOT_FOUND);
              }
        
            await this.prisma.pengadaan.deleteMany({
                where:{
                    id: idPengadaan
                }
            })

            return {
                statusCode: HttpStatus.OK,
                message: "Hapus Data Pengadaan Berhasil"
            }
            
        } catch (error) {
            return {
                statusCode: HttpStatus.BAD_REQUEST,
                message: `Gagal menghapus data pengadaan: ${error.message}`
            }    
        }
    }

    /**
     * Update data pengadaan
     * 
     * @param adminId 
     * @param idPengadaan 
     * @param data 
     * @returns 
     */
    async updateDataPengadaan(adminId: number, idPengadaan: number, data: UpdatePengadaanDto, id: number){
        try {
            const checkUser = await this.prisma.admin.findFirst({
                where: {
                    id: adminId
                }
            })

            const pengadaan = await this.prisma.pengadaan.findUnique({
                where: {
                  id: idPengadaan,
                },
            });

            if(checkUser.id !== id && !pengadaan) {
                throw new HttpException('Bad Request', HttpStatus.NOT_FOUND);
              }
        
            await this.prisma.pengadaan.updateMany({
                where: {
                    id: idPengadaan
                },
                data: {
                    nama_pengadaan: data.nama_pengadaan,
                    deskripsi: data.deskripsi,
                    anggaran: data.anggaran
                    // updated_at: new Date()
                  },
            })

            return {
                statusCode: HttpStatus.OK,
                message: "Update Data Pengadaan Berhasil"
            }
            
        } catch (error) {
            return {
                statusCode: HttpStatus.BAD_REQUEST,
                message: `Gagal update data pengadaan: ${error.message}`
            }    
        }
    } 

    /**
     * List Pengadaan Aktif
     * 
     * @returns 
     */
    async listPengadaanAktif(keyword: any, page: number = 1, limit: number = 10) {
        try {
            const skip = (page - 1) * limit;

            const where: Prisma.pengadaanWhereInput = keyword
            ? {
                OR: [
                {
                    nama_pengadaan: {
                    contains: keyword
                    },
                    status: 1
                },
                ],
            }
            : {};

            const allPengadaan = await this.prisma.pengadaan.findMany({
                where,
                skip,
                take: limit,
            });
            
            const totalItems = await this.prisma.pengadaan.count({ where });
            
            return {
                statusCode: HttpStatus.OK,
                message: "Data list pengadaan aktif",
                data: {
                    allPengadaan,
                    totalItems,
                    totalPages: Math.ceil(totalItems / limit),
                    currentPage: page
                }
            }
        } catch (error) {
            return {
                statusCode: HttpStatus.BAD_REQUEST,
                message: error.message
            }
        }
    }
}
