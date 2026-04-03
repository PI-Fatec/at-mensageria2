/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Pedido } from './pedido.entity';
import { Produto } from './produto.entity';

@Entity('item_pedido')
export class ItemPedido {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('decimal', { precision: 10, scale: 2 })
  preco_unitario!: number;

  @Column('int')
  quantidade!: number;

  @ManyToOne(() => Pedido, (pedido: Pedido) => pedido.itens, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'pedido_uuid' })
  pedido!: Pedido;

  @ManyToOne(() => Produto, (produto: Produto) => produto.itens)
  @JoinColumn({ name: 'produto_id' })
  produto!: Produto;
}