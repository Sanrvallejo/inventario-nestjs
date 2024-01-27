import { CategoriaEnum } from 'src/enums/categoria.enum';
import { Medida } from 'src/enums/medida.enum';
import { Usuario } from 'src/usuario/entities/usuario.entity';
import { VentasProductos } from 'src/ventas/entities/ventas-productos.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Producto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'bigint', unique: true })
  codigoBarra: number;

  @Column({ type: 'text' })
  nombre: string;

  @Column({ type: 'double' })
  costoXunidad: number;

  @Column({ type: 'double' })
  precioVenta: number;

  @Column({ type: 'double' })
  cantidadIngresada: number;

  @Column({ type: 'double', nullable: true, default: 0 })
  cantidadActual: number;

  @Column({ type: 'datetime', default: () => 'CUURENT_TIMESTAMP' })
  fechaIngreso: Date;

  @Column({ type: 'bool', default: false })
  avisoReposicion: boolean;

  @Column({ type: 'bool', default: true })
  activo: boolean;

  @Column({ type: 'enum', enum: Medida })
  medida: Medida;

  @Column({ type: 'enum', enum: CategoriaEnum })
  categoria: CategoriaEnum;

  @OneToMany(
    () => VentasProductos,
    (ventasProductos) => ventasProductos.producto,
  )
  ventasProductos: VentasProductos[];

  @ManyToOne(() => Usuario, (usuario) => usuario.producto, { eager: true })
  usuario: Usuario;
}
