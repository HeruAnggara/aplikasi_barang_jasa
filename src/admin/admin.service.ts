import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { jwt_config } from 'src/config/config_jwt';
import { RegisterDto } from './dto/registerdto';
import { EditDto } from './dto/edit.dto';
import { NonAktifDto } from './dto/nonaktif.dto';
import { EditPasswordDTO } from './dto/editPassword.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class AdminService {
    constructor(private prisma: PrismaService, private jwtService: JwtService){}

     /**
   * Register new user
   * @param data
   * @returns
   */
     async register(data: RegisterDto){
      const checkUser = await this.prisma.admin.findFirst({
          where: {
              email: data.email
          }
      });
      
      if(checkUser) {
          throw new HttpException('Data tersebut sudah terdaftar', HttpStatus.FOUND);
      }
      data.password = await hash(data.password, 12);
      const createUser = await this.prisma.admin.create({
          data
      })

      if (createUser) {
          return {
            statusCode: 200,
            message: 'Register Berhasil',
          };
        }
  }

    /**
     * Generate JWT Token
     * @param payload
     * @returns
     */
    generateJWT(payload: any) {
        return this.jwtService.sign(payload, {
            secret: jwt_config.secret,
            expiresIn: jwt_config.expired,
        });
    }
            
    /**
     * Login user
     * @param data 
     */
    async login(data: LoginDto){
        const checkUserExists = await this.prisma.admin.findFirst({
            where: {
                email: data.email,
            },
        });
        if (!checkUserExists) {
            throw new HttpException('Pengguna tidak ditemukan', HttpStatus.NOT_FOUND);
        }

        const checkPassword = await compare(
            data.password,
            checkUserExists.password,
          );
          if (checkPassword) {
            const accessToken = this.generateJWT({
              sub: checkUserExists.id,
              nama: checkUserExists.nama,
              email: checkUserExists.email,
            });
            return {
              statusCode: 200,
              message: 'Login berhasil',
              token: accessToken,
            };
          } else {
            throw new HttpException(
              'Email atau password tidak cocok',
              HttpStatus.UNAUTHORIZED,
            );
          }
    }

    /**
     * Edit Data Admin
     * @param data
     */
    async editDataAdmin(adminId: number, newData: EditDto, id: number) {
      const existingAdmin = await this.prisma.admin.findUnique({
        where: { id: adminId },
      });
  
      if(existingAdmin.id !== id) {
        throw new HttpException('Bad Request', HttpStatus.NOT_FOUND);
      }
  
      const updatedAdmin = await this.prisma.admin.update({
        where: { id: adminId },
        data: newData
      });
  
      return {
        statusCode: 200,
        message: 'Data admin berhasil diperbarui',
        admin: updatedAdmin,
      };
    }

    /**
     * Hapus Data Admin
     * @param data
     */
    async hapusAdmin(adminId: number) {
      try {
        const deleteAdmin = await this.prisma.admin.delete({
          where: {
            id: adminId
          }
        })

        return {
          statusCode: 200,
          message: "Data admin berhasil dihapus"
        }
      } catch (error) {        
        return {
          message: error
        }
      }
    }

    /**
     * list admin
     * 
     * @param adminId 
     * @returns 
     */
    async listAdmin(adminId: number, keyword: any, page: number = 1, limit: number = 10, id: number) {
      try {
        const checkUser = await this.prisma.admin.findFirst({
          where: {
              id: adminId
          }
        })
  
        if(checkUser.id !== id) {
          throw new HttpException('Bad Request', HttpStatus.NOT_FOUND);
        }
  
        const skip = (page - 1) * limit;

        const where: Prisma.adminWhereInput = keyword
        ? {
            OR: [
              {
                nama: {
                  contains: keyword
                },
                status: 1
              },
            ],
          }
        : {};
        
        const data = await this.prisma.admin.findMany({
          where,
          skip,
          take: limit,
        })

        const totalItems = await this.prisma.admin.count({ where });

        return {
          statusCode: HttpStatus.OK,
          message: 'List data admin',
          data: {
            data,
            totalItems,
            totalPages: Math.ceil(totalItems / limit),
            currentPage: page,
          }
        }
      } catch (error) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: `Admin tidak ditemukan`
      } 
      }
    }
    
    /**
     * list suplier
     * @param adminId 
     * @param keyword 
     * @param page 
     * @param limit 
     * @returns 
     */
    async listSuplier(adminId: number, keyword: any, page: number = 1, limit: number = 10, id: number) {
      try {
        const checkUser = await this.prisma.admin.findFirst({
          where: {
              id: adminId
          }
        })
  
        if(checkUser.id !== id) {
          throw new HttpException('Bad Request', HttpStatus.NOT_FOUND);
        }
  
        const search = keyword;
        const skip = (page - 1) * limit;

        const where: Prisma.supplierWhereInput = keyword
        ? {
            OR: [
              {
                nama_usaha: {
                  contains: keyword
                },
              },
            ],
          }
        : {};
        
        const data = await this.prisma.supplier.findMany({
          where,
          skip,
          take: limit,
        })

        const totalItems = await this.prisma.supplier.count({ where });

        return {
          statusCode: HttpStatus.OK,
          message: 'List Data suplier',
          data: {
            data,
            totalItems,
            totalPages: Math.ceil(totalItems / limit),
            currentPage: page,
          }
        }
      } catch (error) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: `Admin tidak ditemukan`
        } 
      }
    }

    /**
     * non aktif suplier
     * 
     * @param adminId 
     * @param suplierId 
     * @returns 
     */
    async nonAktifSuplier(adminId: number, data: NonAktifDto, id: number) {
      try {
        const checkUser = await this.prisma.admin.findUnique({
          where: {
              id: adminId
          }
        });

        if(checkUser.id !== id) {
          throw new HttpException('Bad Request', HttpStatus.NOT_FOUND);
        }

        const suplierId = parseInt(data.id)
        await this.prisma.supplier.update({
            where: {
                id: suplierId
            },
            data: {
                status:{
                    set: 0
                }
            }
        })
        return {
            statusCode: HttpStatus.OK,
            message: 'Data suplier dinonaktifkan'
        }
      } catch (error) {
        console.log(error.message);
        
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: `Admin tidak ditemukan`
        } 
      }
    }
    
    /**
     * aktif suplier
     * 
     * @param adminId 
     * @param data 
     * @returns 
     */
    async aktifSuplier(adminId: number, data: NonAktifDto, id: number) {
      try {
        const checkUser = await this.prisma.admin.findUnique({
          where: {
              id: adminId
          }
        });

        if(checkUser.id !== id) {
          throw new HttpException('Bad Request', HttpStatus.NOT_FOUND);
        }

        const suplierId = parseInt(data.id)
        await this.prisma.supplier.update({
            where: {
                id: suplierId
            },
            data: {
                status:{
                    set: 1
                }
            }
        })
        return {
            statusCode: HttpStatus.OK,
            message: 'Data suplier berhasil diverifikasi'
        }
      } catch (error) {
        console.log(error.message);
        
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: `Admin tidak ditemukan`
        } 
      }
    }

    /**
     * edit password
     * 
     * @param adminId 
     * @param data 
     * @returns 
     */
    async editPassword(adminId: number, data: EditPasswordDTO, id: number){
      try {
        const checkUserExists = await this.prisma.admin.findFirst({
          where: {
              id: adminId,
          },
      });
      if(checkUserExists.id !== id) {
        throw new HttpException('Bad Request', HttpStatus.NOT_FOUND);
      }

      const checkPassword = await compare(
          data.oldPassword,
          checkUserExists.password,
        );
        if (checkPassword) {
          data.newPassword = await hash(data.newPassword, 12);
          await this.prisma.admin.update({
            where: {
              id: adminId
            },
            data: {
              password: data.newPassword
            }
          })
          return {
            statusCode: 200,
            message: 'Edit paswword admin berhasil',
          };
        } else {
          throw new HttpException(
            'Password tidak cocok',
            HttpStatus.UNAUTHORIZED,
          );
        }
      } catch (error) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: error.message
        }
      }
    }
}
