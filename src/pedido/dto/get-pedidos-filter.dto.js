import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsInt, Min, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export const StatusPedido = {
  CREATED: 'created',
  CONFIRMED: 'confirmed',
  PENDING: 'pending',
  PAID: 'paid',
  SHIPPED: 'shipped',
  SEPARATED: 'separated',
  DELIVERED: 'delivered',
  CANCELED: 'canceled',
  CANCELLED: 'cancelled',
};

export const OrdenacaoDataPedido = {
  ASC: 'asc',
  DESC: 'desc',
};

export class GetPedidosFilterDto {
  @ApiPropertyOptional({ description: 'Número da página', default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1;

  @ApiPropertyOptional({ description: 'Itens por página', default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit = 10;

  @ApiPropertyOptional({ description: 'Filtrar pelo ID do cliente' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  codigoCliente;

  @ApiPropertyOptional({ description: 'Filtrar pelo ID do produto' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  produtoId;

  @ApiPropertyOptional({ description: 'Status do pedido', enum: StatusPedido })
  @IsOptional()
  @IsEnum(StatusPedido)
  status;

  @ApiPropertyOptional({ description: 'Ordenação', enum: OrdenacaoDataPedido, default: 'desc' })
  @IsOptional()
  @IsEnum(OrdenacaoDataPedido)
  sort = 'desc';
}