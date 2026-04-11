import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Pedido } from './pedido.entity.js';
import { Produto } from './produto.entity.js';

@Entity('item_pedido')
export class ItemPedido {
  @PrimaryGeneratedColumn()
  id;

  @Column('decimal', { precision: 10, scale: 2 })
  preco_unitario;

  @Column('int')
  quantidade;

  @ManyToOne(() => Pedido, (pedido) => pedido.itens, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'pedido_uuid' })
  pedido;

  @ManyToOne(() => Produto, (produto) => produto.itens)
  @JoinColumn({ name: 'produto_id' })
  produto;
}