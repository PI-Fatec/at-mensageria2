/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { ItemPedido } from './item-pedido';

@Entity('produto')
export class Produto {
  @PrimaryColumn({ type: 'int' })
  id!: number;

  @Column({ length: 255 })
  nome!: string;

  @Column({ type: 'text', nullable: true })
  descricao!: string | null;

  @Column({ type: 'varchar', length: 40, nullable: true })
  categoria_id!: string | null;

  @Column({ type: 'varchar', length: 120, nullable: true })
  categoria_nome!: string | null;

  @Column({ type: 'varchar', length: 40, nullable: true })
  subcategoria_id!: string | null;

  @Column({ type: 'varchar', length: 120, nullable: true })
  subcategoria_nome!: string | null;

  @OneToMany(() => ItemPedido, (item: ItemPedido) => item.produto)
  itens!: ItemPedido[];
}