import { Module } from '@nestjs/common';
import { VentasModule } from './ventas/ventas.module';

@Module({
  imports: [VentasModule]
})
export class AppModule {}
