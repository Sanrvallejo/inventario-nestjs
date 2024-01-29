import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { AdminAccess } from 'src/auth/decorators/admin.decorator';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Controller('user')
@UseGuards(AuthGuard, RolesGuard)
export class UserController {
    constructor(
        private readonly usuario: UsuarioService,
    ){};

    @AdminAccess()
    @Post('crear')
    async createUser(@Body() body: CreateUsuarioDto) {
        return await this.usuario.create(body);
    }

    @AdminAccess()
    @Get('all')
    async findAllUsers() {
        return await this.usuario.findUsers();
    }

    @AdminAccess()
    @Get(':id')
    async findUserById(@Param('id') id: string) {
        return await this.usuario.findUserById(id);
    }

    @AdminAccess()
    @Put('edit/:id')
    async updateUser(@Param('id') id: string, @Body() body: UpdateUsuarioDto) {
        return await this.usuario.updateUser(body, id);
    } 

    @AdminAccess()
    @Delete('/delete/:id')
    async deleteUser(@Param('id') id: string) {
        return await this.usuario.deleteUser(id);
    }
}
