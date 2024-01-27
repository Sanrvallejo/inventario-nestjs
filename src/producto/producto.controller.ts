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

@Controller('producto')
export class ProductoController {
  constructor(private readonly productoService: ProductoService) {}

  @Get()
  getAllProductos(): Promise<Producto[]> {
    return this.productoService.findAll();
  }

  @Get('codigo/:codigo')
  getProductoById(@Param('codigo') codigo: number): Promise<Producto> {
    return this.productoService.findById(codigo);
  }

  @Post('crear')
  createProducto(@Body() producto: Producto): Promise<Producto> {
    return this.productoService.create(producto);
  }

  @Put(':id')
  updateProducto(
    @Param('id') id: number,
    @Body() producto: Producto,
  ): Promise<void> {
    return this.productoService.update(id, producto);
  }

  @Delete(':id')
  deleteProducto(@Param('id') id: number): Promise<void> {
    return this.productoService.delete(id);
  }
}
