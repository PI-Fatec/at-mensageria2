import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PedidoModule } from './pedido/pedido.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST ?? 'localhost',
      port: Number(process.env.DB_PORT ?? 5432),
      username: process.env.DB_USER ?? 'root',
      password: process.env.DB_PASSWORD ?? 'rootpassword',
      database: process.env.DB_NAME ?? 'marketplace',
      autoLoadEntities: true,
      synchronize: true,
    }),
    PedidoModule,
  ],
})
export class AppModule {}
