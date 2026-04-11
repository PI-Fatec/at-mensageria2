import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsDateString, IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { StatusPedido } from './get-pedidos-filter.dto.js';

class CategoryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  id;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name;

  @ApiPropertyOptional({ type: () => CategoryDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => CategoryDto)
  sub_category;
}

class ItemMarketplaceDto {
  @ApiProperty()
  @IsInt()
  product_id;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  product_name;

  @ApiProperty()
  @IsInt()
  quantity;

  @ApiProperty()
  @IsNumber()
  unit_price;

  @ApiPropertyOptional({ type: () => CategoryDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => CategoryDto)
  category;
}

class CustomerDto {
  @ApiProperty()
  @IsInt()
  id;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  email;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  document;
}

export class CreatePedidoDto {
  @ApiProperty({ description: 'UUID gerado pelo sistema' })
  @IsString()
  @IsNotEmpty()
  uuid;

  @ApiProperty({ description: 'Data do pedido' })
  @IsDateString()
  created_at;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  channel;

  @ApiProperty({ enum: StatusPedido })
  @IsEnum(StatusPedido)
  status;

  @ApiProperty({ type: () => CustomerDto })
  @ValidateNested()
  @Type(() => CustomerDto)
  customer;

  @ApiPropertyOptional({ type: 'object' })
  @IsOptional()
  seller;

  @ApiPropertyOptional({ type: 'object' })
  @IsOptional()
  shipment;

  @ApiPropertyOptional({ type: 'object' })
  @IsOptional()
  payment;

  @ApiPropertyOptional({ type: 'object' })
  @IsOptional()
  metadata;

  @ApiProperty({ type: [ItemMarketplaceDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemMarketplaceDto)
  items;
}