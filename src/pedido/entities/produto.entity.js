import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { ItemPedido } from './item-pedido.js';

@Entity('produto')
export class Produto {
  @PrimaryColumn({ type: 'int' })
  id;

  @Column({ length: 255 })
  nome;

  @Column({ type: 'text', nullable: true })
  descricao;

  @Column({ type: 'varchar', length: 40, nullable: true })
  categoria_id;

  @Column({ type: 'varchar', length: 120, nullable: true })
  categoria_nome;

  @Column({ type: 'varchar', length: 40, nullable: true })
  subcategoria_id;

  @Column({ type: 'varchar', length: 120, nullable: true })
  subcategoria_nome;

  @OneToMany(() => ItemPedido, (item) => item.produto)
  itens;
}