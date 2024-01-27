import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class VentasXDia {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'datetime' })
    diaVenta: Date;

    @Column({ type: 'integer' })
    totalVentasRealizadas: number;

    @Column({ type: 'double' })
    totalAcumulado: number;

    @Column({ type: 'datetime' })
    fechaCierreCaja: Date;

    @Column({ type: 'double' })
    ganancia: number;

    //TODO: Usuario
}