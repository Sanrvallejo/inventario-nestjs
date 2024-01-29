import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ProductoService } from './producto.service';
import { Producto } from './entities/producto.entity';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { Usuario } from 'src/usuario/entities/usuario.entity';
import { AdminAccess } from 'src/auth/decorators/admin.decorator';

@Controller('producto')
@UseGuards(AuthGuard, RolesGuard)
export class ProductoController {
  constructor(private readonly productoService: ProductoService) {}

  @Roles('VENDEDOR')
  @Get()
  getAllProductos(@GetUser() ususario: any): Promise<Producto[]> {
    return this.productoService.findAll(ususario);
  }

  @Roles('VENDEDOR')
  @Get('codigo/:codigo')
  getProductoById(
    @Param('codigo') codigo: number,
    @GetUser() usuario: Usuario,
  ): Promise<Producto> {
    return this.productoService.findById(codigo, usuario);
  }

  @AdminAccess()
  @Post('crear')
  createProducto(
    @Body() producto: Producto,
    @GetUser() usuario: Usuario,
  ): Promise<Producto> {
    return this.productoService.create(producto, usuario);
  }

  @AdminAccess()
  @Put(':id')
  updateProducto(
    @Param('id') id: number,
    @Body() producto: Producto,
  ): Promise<void> {
    return this.productoService.update(id, producto);
  }

@AdminAccess()
  @Delete(':id')
  deleteProducto(@Param('id') id: number): Promise<void> {
    return this.productoService.delete(id);
  }
}
