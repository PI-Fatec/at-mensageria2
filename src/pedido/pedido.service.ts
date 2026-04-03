/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pedido } from './entities/pedido.entity';
import { GetPedidosFilterDto } from './dto/get-pedidos-filter.dto';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { Cliente } from './entities/cliente.entity';
import { Produto } from './entities/produto.entity';
import { ItemPedido } from './entities/item-pedido';

@Injectable()
export class PedidoService {
  constructor(
    @InjectRepository(Pedido)
    private readonly pedidoRepository: Repository<Pedido>,
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
    @InjectRepository(Produto)
    private readonly produtoRepository: Repository<Produto>,
    @InjectRepository(ItemPedido)
    private readonly itemPedidoRepository: Repository<ItemPedido>,
  ) {}

  async salvarPedidoDoMarketplace(dto: CreatePedidoDto) {
    const pedidoExistente = await this.pedidoRepository.findOne({
      where: { uuid: dto.uuid },
      relations: ['cliente', 'itens', 'itens.produto'],
    });

    if (pedidoExistente) {
      return this.formatarPayload(pedidoExistente);
    }

    let cliente = await this.clienteRepository.findOne({
      where: { id: dto.customer.id },
    });

    if (!cliente) {
      cliente = this.clienteRepository.create({
        id: dto.customer.id,
        nome: dto.customer.name ?? `Cliente ${dto.customer.id}`,
        email: dto.customer.email ?? `cliente${dto.customer.id}@sem-email.local`,
        document: dto.customer.document ?? null,
      });
      await this.clienteRepository.save(cliente);
    } else {
      cliente.nome = dto.customer.name ?? cliente.nome;
      cliente.email = dto.customer.email ?? cliente.email;
      cliente.document = dto.customer.document ?? cliente.document;
      await this.clienteRepository.save(cliente);
    }

    const pedido = this.pedidoRepository.create({
      uuid: dto.uuid,
      status: dto.status,
      channel: dto.channel ?? null,
      data_criacao_marketplace: new Date(dto.created_at),
      cliente,
      seller: dto.seller ?? null,
      shipment: dto.shipment ?? null,
      payment: dto.payment ?? null,
      metadata: dto.metadata ?? null,
    });

    const pedidoSalvo = await this.pedidoRepository.save(pedido);

    for (const itemDto of dto.items) {
      let produto = await this.produtoRepository.findOne({
        where: { id: itemDto.product_id },
      });

      if (!produto) {
        produto = this.produtoRepository.create({
          id: itemDto.product_id,
          nome: itemDto.product_name ?? `Produto ${itemDto.product_id}`,
          descricao: null,
          categoria_id: itemDto.category?.id ?? null,
          categoria_nome: itemDto.category?.name ?? null,
          subcategoria_id: itemDto.category?.sub_category?.id ?? null,
          subcategoria_nome: itemDto.category?.sub_category?.name ?? null,
        });
      } else {
        produto.nome = itemDto.product_name ?? produto.nome;
        produto.categoria_id = itemDto.category?.id ?? produto.categoria_id;
        produto.categoria_nome = itemDto.category?.name ?? produto.categoria_nome;
        produto.subcategoria_id = itemDto.category?.sub_category?.id ?? produto.subcategoria_id;
        produto.subcategoria_nome = itemDto.category?.sub_category?.name ?? produto.subcategoria_nome;
      }

      await this.produtoRepository.save(produto);

      const item = this.itemPedidoRepository.create({
        pedido: pedidoSalvo,
        produto,
        quantidade: itemDto.quantity,
        preco_unitario: itemDto.unit_price,
      });

      await this.itemPedidoRepository.save(item);
    }

    const pedidoCompleto = await this.pedidoRepository.findOneOrFail({
      where: { uuid: pedidoSalvo.uuid },
      relations: ['cliente', 'itens', 'itens.produto'],
    });

    return this.formatarPayload(pedidoCompleto);
  }

  async findAll(filtros: GetPedidosFilterDto) {
    const { page = 1, limit = 10, codigoCliente, produtoId, status } = filtros;
    
    const query = this.pedidoRepository.createQueryBuilder('pedido')
      .leftJoinAndSelect('pedido.cliente', 'cliente')
      .leftJoinAndSelect('pedido.itens', 'itens')
      .leftJoinAndSelect('itens.produto', 'produto')
      .orderBy('pedido.data_criacao_marketplace', 'DESC');

    if (codigoCliente) query.andWhere('cliente.id = :codigoCliente', { codigoCliente });
    if (status) query.andWhere('pedido.status = :status', { status });
    if (produtoId) query.andWhere('produto.id = :produtoId', { produtoId });

    query.skip((page - 1) * limit).take(limit);

    const [pedidos, total] = await query.getManyAndCount();

    const data = pedidos.map(pedido => this.formatarPayload(pedido));

    return {
      data,
      meta: {
        total,
        page,
        last_page: Math.ceil(total / limit),
      },
    };
  }

  async findOne(uuid: string) {
    const pedido = await this.pedidoRepository.findOne({
      where: { uuid },
      relations: ['cliente', 'itens', 'itens.produto'],
    });

    if (!pedido) {
      throw new NotFoundException(`Pedido com UUID ${uuid} não encontrado.`);
    }

    return this.formatarPayload(pedido);
  }

  // Função privada para calcular e formatar o contrato
  private formatarPayload(pedido: Pedido) {
    let valorTotalPedido = 0;

    const itensMapeados = pedido.itens.map((item) => {
      // Cálculo: valor total de cada item
      const valorTotalItem = item.quantidade * Number(item.preco_unitario);
      valorTotalPedido += valorTotalItem;

      return {
        id: item.id,
        product_id: item.produto.id,
        product_name: item.produto.nome,
        unit_price: Number(item.preco_unitario),
        quantity: item.quantidade,
        category: {
          id: item.produto.categoria_id,
          name: item.produto.categoria_nome,
          sub_category: {
            id: item.produto.subcategoria_id,
            name: item.produto.subcategoria_nome,
          },
        },
        total: parseFloat(valorTotalItem.toFixed(2)),
      };
    });

    return {
      uuid: pedido.uuid,
      created_at: pedido.data_criacao_marketplace,
      channel: pedido.channel,
      total: parseFloat(valorTotalPedido.toFixed(2)),
      status: pedido.status,
      customer: {
        id: pedido.cliente?.id,
        name: pedido.cliente?.nome,
        email: pedido.cliente?.email,
        document: pedido.cliente?.document,
      },
      seller: pedido.seller,
      items: itensMapeados,
      shipment: pedido.shipment,
      payment: pedido.payment,
      metadata: pedido.metadata,
      indexed_at: pedido.data_indexacao,
    };
  }
}