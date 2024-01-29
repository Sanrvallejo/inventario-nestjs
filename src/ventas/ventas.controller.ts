import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Producto } from 'src/producto/entities/producto.entity';
import { MetodoPago } from 'src/enums/metodo-pago.enum';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { VentasService } from './ventas.service';
import { Ventas } from './entities/ventas.entity';
import { Usuario } from 'src/usuario/entities/usuario.entity';


@Controller('venta')
@UseGuards(AuthGuard, RolesGuard)
export class VentasController {
  constructor(private readonly ventasService: VentasService) {}

  @Get()
  @Roles('VENDEDOR')
  getVentas(
    @GetUser() usuarioId: string,
  ): Promise<Ventas[]> {
    return this.ventasService.getVentas(usuarioId);
  }

  @Roles('VENDEDOR')
  @Get(':dia')
  getVentaDia(
    @Query('dia') diaVenta?: string,
    @GetUser() usuarioId?: Usuario) {
    let fechaVenta: Date;
    if (diaVenta) {
      const [year, month, day] = diaVenta.split('-').map(Number);
      fechaVenta = new Date(year, month - 1, day);
      console.log(fechaVenta);
    }
    return this.ventasService.getVentaDia(fechaVenta, usuarioId);
  }

  @Get(':id')
  //Esta función ParseIntPipe convierte lo que venga a numero entero. Es bueno ponerlo para asegurarse de que lo que viene es un número entero.
  getVentaId(@Param('id', ParseIntPipe) id: number) {
    console.log(id);
    console.log(typeof id);
    return this.ventasService.getVentaId(id);
  }

  @Post('registro-venta')
  @Roles('VENDEDOR')
  registrarVenta(
    @Body('productos') productos: Producto[],
    @Body('efectivo') efectivo: number,
    @Body('cantidadVenta') cantidadVenta: number[],
    @Body('metodoPago') metodoPago: MetodoPago,
    @GetUser() user: Usuario,
  ) {
    const venta = this.ventasService.registrarVenta(
      productos,
      efectivo,
      cantidadVenta,
      metodoPago,
      user
    );

    console.log(user);
    
    // Convierte el objeto a JSON manualmente y excluye la propiedad que causa la referencia circular.
    const json = JSON.stringify(venta, (key, value) => {
      if (key === 'venta') {
        return undefined;
      }
      return value;
    });

    // Devuelve el JSON como respuesta.
    return json;
  }
}