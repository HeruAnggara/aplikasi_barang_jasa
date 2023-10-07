import { Body, Controller, Get, Post, Req, UsePipes, ValidationPipe } from '@nestjs/common';
import { SuplierService } from './suplier.service';
import { RegisterDTO } from './dto/registrasi.dto';
import { LoginDto } from './dto/login.dto';

@Controller('suplier')
export class SuplierController {

    constructor(private suplierService: SuplierService){}

    @UsePipes(ValidationPipe)
    @Post('register')
    async register(@Body() data: RegisterDTO) {
        return await this.suplierService.register(data);
    }

    @Post('login')
    async login(@Body() data: LoginDto) {
        return await this.suplierService.login(data);
    }
    
    @Post('logout')
    async logout(@Req() data: LoginDto) {
        return await this.suplierService.logout(data);
    }
}
