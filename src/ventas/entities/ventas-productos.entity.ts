import { Producto } from 'src/producto/entities/producto.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Ventas } from './ventas.entity';

@Entity()
export class VentasProductos {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ventaId: number;

  @Column()
  productoId: number;

  @Column()
  cantidadVenta: number;

  @ManyToOne(() => Producto, (producto) => producto.ventasProductos)
  producto: Producto;

  @ManyToOne(() => Ventas, (ventas) => ventas.ventasProductos)
  venta: Ventas;
}
