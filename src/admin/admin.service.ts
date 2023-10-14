import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { jwt_config } from 'src/config/config_jwt';
import { RegisterDto } from './dto/registerdto';
import { EditDto } from './dto/edit.dto';

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
    async editDataAdmin(adminId: number, newData: EditDto) {
      const existingAdmin = await this.prisma.admin.findUnique({
        where: { id: adminId },
      });
  
      if (!existingAdmin) {
        throw new HttpException('Admin tidak ditemukan', HttpStatus.NOT_FOUND);
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
    async listAdmin(adminId: number) {
      try {
        const checkUser = await this.prisma.admin.findFirst({
          where: {
              id: adminId
          }
        })
  
        if(!checkUser) {
          throw new HttpException('Bad Request', HttpStatus.NOT_FOUND);
        }
  
        const data = await this.prisma.admin.findMany({
          where: {
            status: 1
          }
        })

        return {
          statusCode: HttpStatus.OK,
          message: 'List Data Admin',
          data: data
        }
      } catch (error) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: `Admin tidak ditemukan`
      } 
      }
    }
    
    async listSuplier(adminId: number) {
      try {
        const checkUser = await this.prisma.admin.findFirst({
          where: {
              id: adminId
          }
        })
  
        if(!checkUser) {
          throw new HttpException('Bad Request', HttpStatus.NOT_FOUND);
        }
  
        const data = await this.prisma.supplier.findMany()

        return {
          statusCode: HttpStatus.OK,
          message: 'List Data suplier',
          data: data
        }
      } catch (error) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: `Admin tidak ditemukan`
      } 
      }
    }
}
