import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Ventas } from './entities/ventas.entity';
import { Producto } from 'src/producto/entities/producto.entity';
import { VentasXDia } from './entities/ventas-x-dia.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from 'src/usuario/entities/usuario.entity';
import { MetodoPago } from 'src/enums/metodo-pago.enum';
import { Medida } from 'src/enums/medida.enum';
import { VentasProductos } from './entities/ventas-productos.entity';

@Injectable()
export class VentasService {
  constructor(
    @InjectRepository(Ventas) private ventasRepository: Repository<Ventas>,
    @InjectRepository(Producto)
    private productoRepository: Repository<Producto>,
    @InjectRepository(VentasXDia)
    private ventasXdiaRepository: Repository<VentasXDia>,
  ) {}

  async getVentaDia(diaVenta?: Date, usuarioId?: Usuario) {
    let fechaVenta: Date;
    if (!diaVenta) {
      fechaVenta = new Date();
    } else {
      fechaVenta = new Date(
        diaVenta.getFullYear(),
        diaVenta.getMonth(),
        diaVenta.getDate(),
      );
    }

    const ventaDia = await this.ventasXdiaRepository
      .createQueryBuilder('ventasXdia')
      .where('ventasXdia.diaVenta BETWEEN :startOfDay AND :endOfDay', {
        startOfDay: fechaVenta,
        endOfDay: new Date(
          fechaVenta.getFullYear(),
          fechaVenta.getMonth(),
          fechaVenta.getDate(),
          23,
          59,
          59,
        ),
      })
      .andWhere('ventasXdia.usuarioId = :userId', { usuarioId })
      .getOne();

    let ventas: Ventas[];
    let acumulado: number = 0;
    let gananciaTotal: number = 0;

    if (ventaDia) {
      //Si ya hay un dia se utilizará el método update para actualizar los valores

      ventas = await this.getVentaFecha(fechaVenta, usuarioId);

      for (let i = 0; i < ventas.length; i++) {
        acumulado += ventas[i].totalAPagar;
        gananciaTotal += ventas[i].gananciaXventa;
      }
      ventaDia.diaVenta = fechaVenta;
      ventaDia.totalVentasRealizadas = ventas.length;
      ventaDia.totalAcumulado = acumulado;
      ventaDia.ganancia = gananciaTotal;
      //ventaDia.ganancia = ganancia
      const cierreCaja = new Date(
        fechaVenta.getFullYear(),
        fechaVenta.getMonth(),
        fechaVenta.getDate(),
        23,
        59,
        59,
      );
      ventaDia.fechaCierreCaja = cierreCaja;
      console.log(ventaDia);

      await this.ventasXdiaRepository.update({ id: ventaDia.id }, ventaDia);

      return {
        resumen: ventaDia,
        ventas: ventas,
      };
    } else {
      console.log('Estoy en el segundo IF');

      const nuevoVentaDia = new VentasXDia();
      ventas = await this.getVentaFecha(diaVenta, usuarioId);
      for (let i = 0; i < ventas.length; i++) {
        acumulado += ventas[i].totalAPagar;
        gananciaTotal += ventas[i].gananciaXventa;
      }

      nuevoVentaDia.diaVenta = fechaVenta;
      nuevoVentaDia.totalVentasRealizadas = ventas.length;
      nuevoVentaDia.totalAcumulado = acumulado;
      nuevoVentaDia.ganancia = gananciaTotal; //Agregado!!!
      //nuevoVentaDia.ganancia = ganancia
      const cierreCaja = new Date(
        fechaVenta.getFullYear(),
        fechaVenta.getMonth(),
        fechaVenta.getDate(),
        23,
        59,
        59,
      );
      nuevoVentaDia.fechaCierreCaja = cierreCaja;
      nuevoVentaDia.usuario = usuarioId;
      console.log(nuevoVentaDia);

      await this.ventasXdiaRepository.save(nuevoVentaDia);
      return {
        resumen: nuevoVentaDia,
        ventas: ventas,
      };
    }
  }

  async registrarVenta(
    productos: {
      nombre: string;
      codigoBarra: number;
    }[],
    efectivo: number,
    cantidadVenta: number[],
    metodoPago: MetodoPago,
    usuario: Usuario,
  ) {
    const nuevaVenta = new Ventas();
    nuevaVenta.ventasProductos = [];
    nuevaVenta.totalAPagar = 0;
    nuevaVenta.gananciaXventa = 0;
    nuevaVenta.metodoPago = metodoPago; //Agregado

    for (let i = 0; i < productos.length; i++) {
      const productoEncontrado =
        (await this.productoRepository
          .createQueryBuilder('producto')
          .where('producto.nombre = :nombre', { nombre: productos[i].nombre })
          .andWhere('producto.codigoBarra = :codigoBarra', {
            codigoBarra: productos[i].codigoBarra,
          })
          .andWhere('producto.usuarioId = :usuario', { usuario })
          .getOne()) || undefined;

      //Verificar la existencia de producto
      if (productoEncontrado) {
        //Verificar la medida del producto.
        if (productoEncontrado.medida === Medida.UNIDAD) {
          //Verificar la disponibilidad de stock.
          if (cantidadVenta[i] <= productoEncontrado.cantidadActual) {
            const totalPrecioProductos =
              productoEncontrado.precioVenta * cantidadVenta[i];
            nuevaVenta.totalAPagar += totalPrecioProductos;

            const gananciaXproducto =
              totalPrecioProductos -
              productoEncontrado.costoXunidad * cantidadVenta[i];
            nuevaVenta.gananciaXventa += gananciaXproducto; //Agregado!!!

            const ventasProductos = new VentasProductos();
            ventasProductos.venta = nuevaVenta;
            ventasProductos.producto = productoEncontrado;
            ventasProductos.cantidadVenta = cantidadVenta[i];
            nuevaVenta.ventasProductos.push(ventasProductos);
            console.log('Producto registrado en venta');
          } else {
            return new HttpException(
              'La cantidad de productos a vender supera el stock disponible',
              HttpStatus.CONFLICT,
            );
          }
        } else if (productoEncontrado.medida === Medida.PESO) {
          if (cantidadVenta[i] < productoEncontrado.cantidadActual) {
            const totalPrecioProductos =
              productoEncontrado.precioVenta * cantidadVenta[i];
            nuevaVenta.totalAPagar += totalPrecioProductos;

            const gananciaXproducto =
              totalPrecioProductos -
              productoEncontrado.costoXunidad * cantidadVenta[i];
            nuevaVenta.gananciaXventa += gananciaXproducto; //Agregado!!!

            const ventasProductos = new VentasProductos();
            ventasProductos.venta = nuevaVenta;
            ventasProductos.producto = productoEncontrado;
            ventasProductos.cantidadVenta = cantidadVenta[i];
            nuevaVenta.ventasProductos.push(ventasProductos);
            console.log('Producto registrado en venta');
          } else {
            return new HttpException(
              'La cantidad de productos a vender supera el stock disponible',
              HttpStatus.CONFLICT,
            );
          }
        }
      } else {
        return console.log('Este producto no esta registrado en el inventario');
      }

      productoEncontrado.cantidadActual -= cantidadVenta[i];
      await this.productoRepository.update(
        productoEncontrado.id,
        productoEncontrado,
      );
    }

    const ventaFactura =
      Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;

    nuevaVenta.ventaFactura = ventaFactura;
    nuevaVenta.efectivo = efectivo;
    nuevaVenta.cambio = efectivo - nuevaVenta.totalAPagar;
    nuevaVenta.usuario = usuario;

    return await this.ventasRepository.save(nuevaVenta);
  }

  getVentas(usuarioId: string) {
    return this.ventasRepository
      .createQueryBuilder('ventas')
      .leftJoinAndSelect('ventas.ventasProductos', 'ventasProductos')
      .leftJoinAndSelect('ventasProductos.producto', 'producto')
      .where('ventas.usuarioId = :usuarioId', { usuarioId })
      .getMany();
  }
  //'ventasProductos', 'ventasProductos.producto'
  async getVentaId(id: number) {
    const ventaEncontrada = await this.ventasRepository.findOne({
      where: {
        id,
      },
      relations: ['productos'],
    });

    if (!ventaEncontrada) {
      return new HttpException('user not found', HttpStatus.NOT_FOUND);
    }

    return ventaEncontrada;
  }

  //Este método devuelve un array de ventas encontradas en el día específico
  //Se le debe pasar a este método el usuario que consulta para que encuentre las ventas
  async getVentaFecha(fecha: Date, usuarioId: Usuario): Promise<Ventas[]> {
    const startOfDay = new Date(
      fecha.getFullYear(),
      fecha.getMonth(),
      fecha.getDate(),
    );
    const endOfDay = new Date(
      fecha.getFullYear(),
      fecha.getMonth(),
      fecha.getDate(),
      23,
      59,
      59,
      999,
    );
    const ventasEncontradas = await this.ventasRepository
      .createQueryBuilder('ventas')
      .leftJoinAndSelect('ventas.ventasProductos', 'ventasProductos')
      .leftJoinAndSelect('ventasProductos.producto', 'producto')
      .where('ventas.fechaVenta BETWEEN :startOfDay AND :endOfDay', {
        startOfDay,
        endOfDay,
      })
      .andWhere('ventas.usuarioId = :usuarioId', { usuarioId })
      .getMany();

    return ventasEncontradas;
  }
}
