import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { AdminService } from './admin.service';
import { RegisterDto } from './dto/registerdto';
import { EditDto } from './dto/edit.dto';
import { AuthGuard } from './admin.guard';

@Controller('admin')
export class AdminController {
    constructor(private adminService: AdminService){}

    @Get(':adminId/list/admin')
    @UseGuards(AuthGuard)
    async listAdmin(@Param('adminId', ParseIntPipe) adminId: number) {
        return await this.adminService.listAdmin(adminId);
    }
    
    @Get(':adminId/list/suplier')
    @UseGuards(AuthGuard)
    async listSuplier(@Param('adminId', ParseIntPipe) adminId: number) {
        return await this.adminService.listSuplier(adminId);
    }

    @UsePipes(ValidationPipe)
    @Post('register')
    async register(@Body() data: RegisterDto) {
        return await this.adminService.register(data);
    }

    @UsePipes(ValidationPipe)
    @Post('login')
    async login(@Body() data: LoginDto) {
        return await this.adminService.login(data);
    }

    @UsePipes(ValidationPipe)
    @Put(':adminId/edit')
    @UseGuards(AuthGuard)
    async editDataAdmin(@Param('adminId', ParseIntPipe) adminId: number, @Body() newData: EditDto) {        
        return this.adminService.editDataAdmin(adminId, newData);
    }
    
    @Delete(':adminId/delete')
    @UseGuards(AuthGuard)
    async hapusAdmin(@Param('adminId', ParseIntPipe) adminId: number) {        
        return this.adminService.hapusAdmin(adminId);
    }
}
