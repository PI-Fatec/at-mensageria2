import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PedidoService } from './pedido.service.js';
import { PedidoController } from './pedido.controller.js';
import { PedidoConsumerService } from './pedido.consumer.js';
import { Pedido } from './entities/pedido.entity.js';
import { Cliente } from './entities/cliente.entity.js';
import { Produto } from './entities/produto.entity.js';
import { ItemPedido } from './entities/item-pedido.js';

@Module({
  imports: [TypeOrmModule.forFeature([Pedido, Cliente, Produto, ItemPedido])],
  controllers: [PedidoController],
  providers: [PedidoService, PedidoConsumerService],
})
export class PedidoModule {}