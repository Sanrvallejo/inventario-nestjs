import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Rol } from 'src/enums/rol.enum';

export class CreateUsuarioDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsNotEmpty()
  @IsString()
  apellido: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsEnum(Rol)
  rol: Rol;
}
