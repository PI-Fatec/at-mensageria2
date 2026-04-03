import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { Pedido } from './pedido.entity';

@Entity('cliente')
export class Cliente {
  @PrimaryColumn({ type: 'int' })
  id!: number;

  @Column({ length: 255 })
  nome!: string;

  @Column({ length: 255, unique: true })
  email!: string;

  @Column({ type: 'varchar', length: 30, nullable: true })
  document!: string | null;

  @OneToMany(() => Pedido, (pedido: Pedido) => pedido.cliente)
  pedidos!: Pedido[];
}