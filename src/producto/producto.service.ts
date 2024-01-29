import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from './entities/producto.entity';
import { Usuario } from 'src/usuario/entities/usuario.entity';
@Injectable()
export class ProductoService {
  constructor(
    @InjectRepository(Producto)
    private productoRepository: Repository<Producto>,
  ) {}

  async findAll(usuarioId: string): Promise<Producto[]> {
    return await this.productoRepository
      .createQueryBuilder('producto')
      .where('producto.usuario_id = :usuarioId', { usuarioId })
      .getMany();
  }

  async findById(codigo: number, usuario: Usuario): Promise<Producto> {
    return await this.productoRepository
      .createQueryBuilder('producto')
      .where('producto.usuarioId = :usuario', { usuario })
      .andWhere('producto.codigoBarra = :codigo', { codigo })
      .getOne();
  }

  async update(id: number, producto: Producto): Promise<void> {
    await this.productoRepository.update(id, producto);
  }

  async create(producto: Producto, usuario: Usuario): Promise<Producto> {
    //producto.cantidadActual = 0;
    producto.cantidadActual =
      (producto.cantidadActual ?? 0) + producto.cantidadIngresada;
    producto.usuario = usuario;
    return this.productoRepository.save(producto);
  }

  async delete(id: number): Promise<void> {
    await this.productoRepository.delete(id);
  }
}
