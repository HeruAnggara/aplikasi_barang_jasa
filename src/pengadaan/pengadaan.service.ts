import {  HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PengadaanDto } from './dto/pengadaan.dto';
import * as fs from 'fs';
import { UpdateGambarDto } from './dto/updateGambar.dto';
import { UpdatePengadaanDto } from './dto/updatePengadaan.dto';

@Injectable()
export class PengadaanService {
    constructor(private prisma: PrismaService){}

    /**
     * List Pengadaan
     */
    async listPengadaan() {
        try {
            const allPengadaan = await this.prisma.pengadaan.findMany();
            
            return {
                statusCode: HttpStatus.OK,
                message: "Data list pengadaan",
                data: allPengadaan
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
    async tambahPengadaan(adminId: number, data: PengadaanDto, gambar){
        try {
              const checkUser = await this.prisma.admin.findFirst({
                where: {
                    id: adminId
                }
              })

              if(checkUser){
                const tambahData = await this.prisma.pengadaan.create({
                    data: {
                        nama_pengadaan: data.nama_pengadaan,
                        deskripsi: data.deskripsi,
                        anggaran: data.anggaran,
                        gambar: gambar
                    }
                  })

                  return {
                    statusCode: HttpStatus.OK,
                    message: "Tambah Data Pengadaan",
                    data: tambahData
                  }
              }
              
              throw new HttpException('Bad Request', HttpStatus.NOT_FOUND);
              

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
    async deleteUploadedFile(adminId: number, idPengadaan: number) {
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

            if(!checkUser && !pengadaan) {
                throw new HttpException('Bad Request', HttpStatus.NOT_FOUND);
            }

            const filePath = `public${pengadaan.gambar}`;
        
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
    async updateFileGambar(adminId: number, idPengadaan: number, data: UpdateGambarDto){
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

            if(!checkUser && !pengadaan) {
                throw new HttpException('Bad Request', HttpStatus.NOT_FOUND);
            }
        
            await this.prisma.pengadaan.update({
                where: {
                    id: idPengadaan
                },
                data: {
                    gambar: data.gambar
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
    async deletePengadaan(adminId: number, idPengadaan: number) {
        try {
            const checkUser = await this.prisma.admin.findFirst({
                where: {
                    id: adminId
                }
            })

            if(!checkUser) {
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

    async updateDataPengadaan(adminId: number, idPengadaan: number, data: UpdatePengadaanDto){
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

            if(!checkUser && !pengadaan) {
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
}
