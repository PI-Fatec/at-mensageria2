/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { PedidoService } from './pedido.service';
import { GetPedidosFilterDto } from './dto/get-pedidos-filter.dto';

@ApiTags('Orders')
@Controller('orders')
export class PedidoController {
  constructor(private readonly pedidoService: PedidoService) {}

  @Get()
  @ApiOperation({ summary: 'Listar pedidos com filtros, ordenação e paginação' })
  @ApiResponse({ status: 200, description: 'Retorna a lista de pedidos de acordo com o payload exigido.' })
  async getOrders(@Query() filtros: GetPedidosFilterDto) {
    return this.pedidoService.findAll(filtros);
  }

  @Get(':uuid')
  @ApiOperation({ summary: 'Buscar um pedido específico pelo UUID' })
  @ApiParam({ name: 'uuid', description: 'UUID gerado pelo marketplace', type: 'string' })
  @ApiResponse({ status: 200, description: 'Retorna o contrato completo do pedido encontrado.' })
  @ApiResponse({ status: 404, description: 'Pedido não encontrado na base relacional.' })
  async getOrderByUuid(@Param('uuid') uuid: string) {
    return this.pedidoService.findOne(uuid);
  }
}
