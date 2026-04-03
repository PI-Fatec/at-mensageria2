import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PedidoService } from './pedido.service';
import { PedidoController } from './pedido.controller';
import { PedidoConsumerService } from './pedido.consumer';
import { Pedido } from './entities/pedido.entity';
import { Cliente } from './entities/cliente.entity';
import { Produto } from './entities/produto.entity';
import { ItemPedido } from './entities/item-pedido';

@Module({
  // Importe as entidades aqui no forFeature
  imports: [TypeOrmModule.forFeature([Pedido, Cliente, Produto, ItemPedido])],
  controllers: [PedidoController],
  providers: [PedidoService, PedidoConsumerService],
})
export class PedidoModule {}