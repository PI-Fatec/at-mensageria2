import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { Pedido } from './pedido.entity.js';

@Entity('cliente')
export class Cliente {
  @PrimaryColumn({ type: 'int' })
  id;

  @Column({ type: 'varchar', length: 255 })
  nome;

  @Column({ type: 'varchar', length: 255, unique: true })
  email;

  @Column({ type: 'varchar', length: 30, nullable: true })
  document;

  @OneToMany(() => Pedido, (pedido) => pedido.cliente)
  pedidos;
}