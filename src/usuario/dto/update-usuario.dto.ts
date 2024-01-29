import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Rol } from 'src/enums/rol.enum';

export class UpdateUsuarioDto {
  @IsOptional()
  @IsString()
  nombre: string;

  @IsOptional()
  @IsString()
  apellido: string;

  @IsOptional()
  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  password: string;

  @IsOptional()
  @IsEnum(Rol)
  rol: Rol;
}
