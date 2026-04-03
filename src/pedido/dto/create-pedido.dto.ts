/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsDateString, IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { StatusPedido } from './get-pedidos-filter.dto';

class CategoryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  id?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ type: () => CategoryDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => CategoryDto)
  sub_category?: CategoryDto;
}

class ItemMarketplaceDto {
  @ApiProperty()
  @IsInt()
  product_id!: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  product_name?: string;

  @ApiProperty()
  @IsInt()
  quantity!: number;

  @ApiProperty()
  @IsNumber()
  unit_price!: number;

  @ApiPropertyOptional({ type: () => CategoryDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => CategoryDto)
  category?: CategoryDto;
}

class CustomerDto {
  @ApiProperty()
  @IsInt()
  id!: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  document?: string;
}

export class CreatePedidoDto {
  @ApiProperty({ description: 'UUID gerado pelo sistema de vendas' })
  @IsString()
  @IsNotEmpty()
  uuid!: string;

  @ApiProperty({ description: 'Data em que o pedido foi feito no marketplace' })
  @IsDateString()
  created_at!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  channel?: string;

  @ApiProperty({ enum: StatusPedido })
  @IsEnum(StatusPedido)
  status!: StatusPedido;

  @ApiProperty({ type: () => CustomerDto })
  @ValidateNested()
  @Type(() => CustomerDto)
  customer!: CustomerDto;

  @ApiPropertyOptional({ type: 'object', additionalProperties: true })
  @IsOptional()
  seller?: Record<string, unknown>;

  @ApiPropertyOptional({ type: 'object', additionalProperties: true })
  @IsOptional()
  shipment?: Record<string, unknown>;

  @ApiPropertyOptional({ type: 'object', additionalProperties: true })
  @IsOptional()
  payment?: Record<string, unknown>;

  @ApiPropertyOptional({ type: 'object', additionalProperties: true })
  @IsOptional()
  metadata?: Record<string, unknown>;

  @ApiProperty({ type: [ItemMarketplaceDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemMarketplaceDto)
  items!: ItemMarketplaceDto[];
}