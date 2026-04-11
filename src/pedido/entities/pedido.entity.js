import { Entity, PrimaryColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Cliente } from './cliente.entity.js';
import { ItemPedido } from './item-pedido.js';
import { StatusPedido } from '../dto/get-pedidos-filter.dto.js';

@Entity('pedido')
export class Pedido {
  @PrimaryColumn({ type: 'varchar', length: 120 })
  uuid;

  @Column({ type: 'enum', enum: StatusPedido, default: StatusPedido.CREATED })
  status;

  @Column({ type: 'varchar', length: 100, nullable: true })
  channel;

  @Column({ type: 'timestamp' })
  data_criacao_marketplace;

  @Column({ type: 'timestamp' })
  data_indexacao;

  @Column({ type: 'jsonb', nullable: true })
  seller;

  @Column({ type: 'jsonb', nullable: true })
  shipment;

  @Column({ type: 'jsonb', nullable: true })
  payment;

  @Column({ type: 'jsonb', nullable: true })
  metadata;

  @ManyToOne(() => Cliente, (cliente) => cliente.pedidos)
  @JoinColumn({ name: 'cliente_id' })
  cliente;

  @OneToMany(() => ItemPedido, (item) => item.pedido, { cascade: true })
  itens;
}