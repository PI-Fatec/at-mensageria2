import { Entity, PrimaryColumn, Column, CreateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Cliente } from './cliente.entity';
import { ItemPedido } from './item-pedido';
import { StatusPedido } from '../dto/get-pedidos-filter.dto';

@Entity('pedido')
export class Pedido {
  @PrimaryColumn({ type: 'varchar', length: 120 })
  uuid!: string;

  @Column({ type: 'enum', enum: StatusPedido, default: StatusPedido.CREATED })
  status!: StatusPedido;

  @Column({ type: 'varchar', length: 100, nullable: true })
  channel!: string | null;

  @Column({ type: 'timestamp' })
  data_criacao_marketplace!: Date;

  @CreateDateColumn({ type: 'timestamp' })
  data_indexacao!: Date;

  @Column({ type: 'jsonb', nullable: true })
  seller!: Record<string, unknown> | null;

  @Column({ type: 'jsonb', nullable: true })
  shipment!: Record<string, unknown> | null;

  @Column({ type: 'jsonb', nullable: true })
  payment!: Record<string, unknown> | null;

  @Column({ type: 'jsonb', nullable: true })
  metadata!: Record<string, unknown> | null;

  @ManyToOne(() => Cliente, (cliente: Cliente) => cliente.pedidos)
  @JoinColumn({ name: 'cliente_id' })
  cliente!: Cliente;

  @OneToMany(() => ItemPedido, (item) => item.pedido, { cascade: true })
  itens!: ItemPedido[];
}