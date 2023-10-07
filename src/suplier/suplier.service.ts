import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { RegisterDTO } from './dto/registrasi.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { compare ,hash } from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { jwt_config } from 'src/config/config_jwt';
import { useContainer } from 'class-validator';

@Injectable()
export class SuplierService {
    constructor(private prisma: PrismaService, private jwtService: JwtService){}

    /**
   * Register new user
   * @param data
   * @returns
   */
    async register(data: RegisterDTO){
        const checkUser = await this.prisma.supplier.findFirst({
            where: {
                email: data.email
            }
        });

        if(checkUser) {
            throw new HttpException('Data tersebut sudah terdaftar', HttpStatus.FOUND);
        }
        data.password = await hash(data.password, 12);
        const createUser = await this.prisma.supplier.create({
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
        const checkUserExists = await this.prisma.supplier.findFirst({
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
              nama_usaha: checkUserExists.nama_usaha,
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
     * Logout suplier
     * @params data 
     */
    async logout(data: LoginDto){
      const user = await this.prisma.supplier.findFirst({
        where: {
          email: data.email
        }
      })

      if(!user){
        throw new NotFoundException('Pengguna tidak ditemukan');
      }

      return 'Pengguna berhasil logout';
    }

    getSuplier(){
        return{
            message: "Login Supllier"
        }
    }
}
