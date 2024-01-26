import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { VentasProductos } from './ventas-productos.entity';
import { MetodoPago } from 'src/enums/metodo-pago.enum';

@Entity()
export class Ventas {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'bigint', unique: true })
  ventaFactura: number;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  fechaVenta: Date;

  @Column({ type: 'double', default: 0})
  totalAPagar: number;

  @Column({ type: 'double'})
  efectivo: number;

  @Column({ type: 'double'})
  cambio: number;

  @Column({ type: 'double'})
  gananciaXventa: number;

  @Column({ type: 'enum', enum: MetodoPago, default: MetodoPago.EFECTIVO })
  metodoPago: MetodoPago;

  @OneToMany(
    () => VentasProductos,
    (ventasProductos) => ventasProductos.venta,
  )
  ventasProductos: VentasProductos[];

  //TODO: Usuario
}
