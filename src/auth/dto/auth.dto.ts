import { LoginBody } from '../interfaces/auth.interface';
import { IsNotEmpty, IsString } from 'class-validator';

export class AuthDto implements LoginBody {
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}