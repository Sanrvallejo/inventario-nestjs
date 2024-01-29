import { Global, Module } from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { UsuarioModule } from 'src/usuario/usuario.module';
import { UsuarioService } from 'src/usuario/usuario.service';
import { AuthController } from './controller/auth.controller';

@Global()
@Module({
  imports: [UsuarioModule],
  providers: [AuthService, UsuarioService],
  controllers: [AuthController]
})
export class AuthModule {}
