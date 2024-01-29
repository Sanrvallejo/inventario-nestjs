import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { Usuario } from './entities/usuario.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { HASH_SALT } from 'src/constants/constants';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';


ConfigModule.forRoot({
  envFilePath: '.development.env',
});
const config = new ConfigService();

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}


  async create(user: CreateUsuarioDto): Promise<Usuario> {
    try {
      user.password = await bcrypt.hash(
        user.password,
        +config.get<string>(HASH_SALT),
      );

      return await this.usuarioRepository.save(user);
    } catch (error) {
      throw new Error(error);
    }
  }


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

  async findBy({
    key,
    value,
  }: {
    key: keyof Usuario;
    value: any;
  }): Promise<Usuario> {
    try {
      
      const user: Usuario = await this.usuarioRepository
        .createQueryBuilder('usuario')
        .addSelect('usuario.password')
        .where({ [key]: value }) // esta sintaxis es para que en todas las propiedades de Usuario, se encuentre lo que coincida con key: value.
        .getOne();
      
      return user;
    } catch (error) {
      throw new Error(error);
    }
  }

  async updateUser(
    body: UpdateUsuarioDto,
    id: string,
  ): Promise<UpdateResult | undefined> {
    try {
      const user: UpdateResult = await this.usuarioRepository.update(id, body);
      if (user.affected === 0) {
        return undefined;
      }

      return user;
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteUser(id: string): Promise<DeleteResult | undefined> {
    try {
      const user: DeleteResult = await this.usuarioRepository.delete(id);
      if (user.affected === 0) {
        return undefined;
      }

      return user;
    } catch (error) {
      throw new Error(error);
    }
  }
}
