import { Module } from '@nestjs/common';
import { VentasModule } from './ventas/ventas.module';
import { ProductoModule } from './producto/producto.module';

@Module({
  imports: [VentasModule, ProductoModule]
})
export class AppModule {}
