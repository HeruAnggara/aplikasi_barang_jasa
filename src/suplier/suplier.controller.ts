import { Body, Controller, Param, ParseIntPipe, Patch, Post, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { SuplierService } from './suplier.service';
import { RegisterDTO } from './dto/registrasi.dto';
import { LoginDto } from './dto/login.dto';
import { EditPasswordDTO } from './dto/editPassword.dto';
import { AuthGuard } from 'src/admin/admin.guard';

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

    @Patch(':suplierId/edit/password')
    @UseGuards(AuthGuard)
    async editPassword(@Param('suplierId') suplierId: string, @Body() data: EditPasswordDTO, @Req() req) {
        const {id} = req.user  
        return await this.suplierService.editPassword(suplierId, data, id);
    }
}
