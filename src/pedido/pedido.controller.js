import { Controller, Get, Param, Query, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { PedidoService } from './pedido.service.js';

@ApiTags('Orders')
@Controller('orders')
export class PedidoController {
  constructor(@Inject(PedidoService) pedidoService) {
    this.pedidoService = pedidoService;
  }

  @Get()
  @ApiOperation({ summary: 'Listar pedidos com filtros, ordenação e paginação' })
  @ApiResponse({ status: 200, description: 'Retorna a lista de pedidos de acordo com o payload exigido.' })
  async getOrders(@Query() filtros) {
    return this.pedidoService.findAll(filtros);
  }

  @Get(':uuid')
  @ApiOperation({ summary: 'Buscar um pedido específico pelo UUID' })
  @ApiParam({ name: 'uuid', description: 'UUID gerado pelo marketplace', type: 'string' })
  @ApiResponse({ status: 200, description: 'Retorna o contrato completo do pedido encontrado.' })
  @ApiResponse({ status: 404, description: 'Pedido não encontrado na base relacional.' })
  async getOrderByUuid(@Param('uuid') uuid) {
    return this.pedidoService.findOne(uuid);
  }
}