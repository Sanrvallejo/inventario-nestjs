import { Module } from '@nestjs/common';
import { VentasModule } from './ventas/ventas.module';
import { ProductoModule } from './producto/producto.module';
import { UsuarioModule } from './usuario/usuario.module';

@Module({
  imports: [VentasModule, ProductoModule, UsuarioModule]
})
export class AppModule {}
