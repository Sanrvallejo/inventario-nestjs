import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from './entities/producto.entity';
@Injectable()
export class ProductoService {
  constructor(
    @InjectRepository(Producto)
    private productoRepository: Repository<Producto>,
  ) {}

  async findAll(): Promise<Producto[]> {
    return await this.productoRepository.find();
  }

  async findById(codigo: number): Promise<Producto> {
    return await this.productoRepository
      .createQueryBuilder('producto')
      .where('producto.codigoBarra = :codigo', { codigo })
      .getOne();
  }

  async update(id: number, producto: Producto): Promise<void> {
    await this.productoRepository.update(id, producto);
  }

  async create(producto: Producto): Promise<Producto> {
    //producto.cantidadActual = 0;
    producto.cantidadActual =
      (producto.cantidadActual ?? 0) + producto.cantidadIngresada;
    return this.productoRepository.save(producto);
  }

  async delete(id: number): Promise<void> {
    await this.productoRepository.delete(id);
  }
}
