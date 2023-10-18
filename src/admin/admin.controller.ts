import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Query, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { AdminService } from './admin.service';
import { RegisterDto } from './dto/registerdto';
import { EditDto } from './dto/edit.dto';
import { AuthGuard } from './admin.guard';
import { NonAktifDto } from './dto/nonaktif.dto';
import { EditPasswordDTO } from './dto/editPassword.dto';

@Controller('admin')
export class AdminController {
    constructor(private adminService: AdminService){}

    @Get(':adminId/list/admin')
    @UseGuards(AuthGuard)
    async listAdmin(
        @Param('adminId', ParseIntPipe) adminId: number,
        @Query('keyword') keyword: any,
        @Query('page') page: number,
        @Query('limit') limit: number,
        @Req() req
        ) {
        const {id} = req.user    
        return await this.adminService.listAdmin(adminId, keyword, page, limit, id);
    }
    
    @Get(':adminId/list/suplier')
    @UseGuards(AuthGuard)
    async listSuplier(
        @Param('adminId', ParseIntPipe) adminId: number,
        @Query('keyword') keyword: any,
        @Query('page') page: number,
        @Query('limit') limit: number,
        ) {
        return await this.adminService.listSuplier(adminId, keyword, page, limit);
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

    @Patch(':adminId/nonaktif')
    @UseGuards(AuthGuard)
    async nonAktifSuplier(@Param('adminId', ParseIntPipe) adminId: number, @Body() suplierId: NonAktifDto) {
        return await this.adminService.nonAktifSuplier(adminId, suplierId);
    }
    
    @Patch(':adminId/aktif')
    @UseGuards(AuthGuard)
    async aktifSuplier(@Param('adminId', ParseIntPipe) adminId: number, @Body() suplierId: NonAktifDto) {
        return await this.adminService.aktifSuplier(adminId, suplierId);
    }

    @Patch(':adminId/edit/password')
    @UseGuards(AuthGuard)
    async editPassword(@Param('adminId', ParseIntPipe) adminId: number, @Body() data: EditPasswordDTO) {
        return await this.adminService.editPassword(adminId, data);
    }
    
    @Delete(':adminId/delete')
    @UseGuards(AuthGuard)
    async hapusAdmin(@Param('adminId', ParseIntPipe) adminId: number) {        
        return this.adminService.hapusAdmin(adminId);
    }
}
