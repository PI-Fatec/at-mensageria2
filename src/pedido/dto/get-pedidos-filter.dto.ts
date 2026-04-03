import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsInt, Min, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export enum StatusPedido {
  CREATED = 'created',
  PAID = 'paid',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELED = 'canceled',
}

export class GetPedidosFilterDto {
  @ApiPropertyOptional({ description: 'Número da página para paginação', default: 1 })
  @IsOptional()
  @Type(() => Number) 
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Quantidade de itens por página', default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @ApiPropertyOptional({ description: 'Filtrar pelo ID numérico do cliente' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  codigoCliente?: number;

  @ApiPropertyOptional({ description: 'Filtrar pelo ID numérico do produto' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  produtoId?: number;

  @ApiPropertyOptional({ description: 'Filtrar pelo status atual do pedido', enum: StatusPedido })
  @IsOptional()
  @IsEnum(StatusPedido)
  status?: StatusPedido;
}