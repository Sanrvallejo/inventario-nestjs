import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { Usuario } from './entities/usuario.entity';
import { CreateUserDto } from './dto/create-usuario.dto';

ConfigModule.forRoot({
  envFilePath: '.development.env',
});
const config = new ConfigService();

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  /**To do: Hashsalt
  * async create(user: CreateUserDto): Promise<Usuario> {
    try {
      user.password = await bcrypt.hash(
        user.password,
        +config.get<string>(),
      );

      return await this.usuarioRepository.save(user);
    } catch (error) {
      throw new Error(error);
    }
  }
  *  */

  async findUsers(): Promise<Usuario[]> {
    try {
      return await this.usuarioRepository.find();
    } catch (error) {
      throw new Error(error);
    }
  }

  async findUserById(id: string): Promise<Usuario> {
    try {
      return await this.usuarioRepository
        .createQueryBuilder('usuario')
        .where({ id })
        .getOne();
    } catch (error) {
      throw new Error(error);
    }
  }
}
