import { Exclude } from 'class-transformer';
import { Rol } from 'src/enums/rol.enum';
import { Producto } from 'src/producto/entities/producto.entity';
import { VentasXDia } from 'src/ventas/entities/ventas-x-dia.entity';
import { Ventas } from 'src/ventas/entities/ventas.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class Usuario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column()
  apellido: string;

  @Column({ unique: true })
  email: string;

  @Exclude()
  @Column()
  password: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  fechaAlta: Date;

  @Column({ type: 'bool', default: true })
  activo: boolean;

  @Column({ type: 'enum', enum: Rol })
  rol: Rol;

  @OneToMany(() => Producto, (producto) => producto.usuario)
  producto: Producto[];

  @OneToMany(() => Ventas, (ventas) => ventas.usuario)
  ventas: Ventas[];

  @OneToMany(() => VentasXDia, (ventasXDia) => ventasXDia.usuario)
  ventasXdia: VentasXDia[];
}
