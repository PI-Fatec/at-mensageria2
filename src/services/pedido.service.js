import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma.js';

const statusToDbEnum = {
  created: 'CREATED',
  confirmed: 'CONFIRMED',
  pending: 'PENDING',
  paid: 'PAID',
  shipped: 'SHIPPED',
  separated: 'SEPARATED',
  delivered: 'DELIVERED',
  canceled: 'CANCELED',
  cancelled: 'CANCELLED',
};

const statusFromPrisma = {
  CREATED: 'created',
  CONFIRMED: 'confirmed',
  PENDING: 'pending',
  PAID: 'paid',
  SHIPPED: 'shipped',
  SEPARATED: 'separated',
  DELIVERED: 'delivered',
  CANCELED: 'canceled',
  CANCELLED: 'cancelled',
};

function normalizarStatusPedido(status) {
  const convertido = statusToDbEnum[String(status).toLowerCase()];

  if (!convertido) {
    const error = new Error(`Status invalido: ${status}`);
    error.statusCode = 400;
    throw error;
  }

  return convertido;
}

class PedidoService {
  async salvarPedidoDoMarketplace(dto) {
    return prisma.$transaction(async (tx) => {
      const cliente = await this.salvarOuAtualizarCliente(tx, dto);
      const status = normalizarStatusPedido(dto.status);

      await tx.pedido.upsert({
        where: { uuid: dto.uuid },
        update: {
          status,
          channel: dto.channel ?? null,
          dataCriacaoMarketplace: new Date(dto.created_at),
          dataIndexacao: new Date(),
          clienteId: cliente.id,
          seller: dto.seller ?? Prisma.JsonNull,
          shipment: dto.shipment ?? Prisma.JsonNull,
          payment: dto.payment ?? Prisma.JsonNull,
          metadata: dto.metadata ?? Prisma.JsonNull,
        },
        create: {
          uuid: dto.uuid,
          status,
          channel: dto.channel ?? null,
          dataCriacaoMarketplace: new Date(dto.created_at),
          dataIndexacao: new Date(),
          clienteId: cliente.id,
          seller: dto.seller ?? Prisma.JsonNull,
          shipment: dto.shipment ?? Prisma.JsonNull,
          payment: dto.payment ?? Prisma.JsonNull,
          metadata: dto.metadata ?? Prisma.JsonNull,
        },
      });

      await tx.itemPedido.deleteMany({ where: { pedidoUuid: dto.uuid } });

      for (const item of dto.items) {
        const produto = await this.salvarOuAtualizarProduto(tx, item);
        await tx.itemPedido.create({
          data: {
            pedidoUuid: dto.uuid,
            produtoId: produto.id,
            quantidade: item.quantity,
            precoUnitario: new Prisma.Decimal(item.unit_price),
          },
        });
      }

      return this.findOne(dto.uuid, tx);
    });
  }

  async findAll({ page = 1, limit = 10, codigoCliente, produtoId, status, sort = 'desc' }) {
    const where = {
      ...(codigoCliente ? { clienteId: codigoCliente } : {}),
      ...(status ? { status: normalizarStatusPedido(status) } : {}),
      ...(produtoId ? { itens: { some: { produtoId } } } : {}),
    };

    const [pedidos, total] = await Promise.all([
      prisma.pedido.findMany({
        where,
        include: {
          cliente: true,
          itens: { include: { produto: true } },
        },
        orderBy: { dataCriacaoMarketplace: sort === 'asc' ? 'asc' : 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.pedido.count({ where }),
    ]);

    return {
      data: pedidos.map((pedido) => this.formatarPayload(pedido)),
      meta: {
        total,
        page,
        limit,
        last_page: Math.ceil(total / limit),
      },
    };
  }

  async findOne(uuid, tx = prisma) {
    const pedido = await tx.pedido.findUnique({
      where: { uuid },
      include: {
        cliente: true,
        itens: { include: { produto: true } },
      },
    });

    if (!pedido) {
      const error = new Error(`Pedido com UUID ${uuid} nao encontrado.`);
      error.statusCode = 404;
      throw error;
    }

    return this.formatarPayload(pedido);
  }

  formatarPayload(pedido) {
    let totalPedido = 0;

    const items = pedido.itens.map((item) => {
      const unitPrice = Number(item.precoUnitario);
      const totalItem = Number((item.quantidade * unitPrice).toFixed(2));
      totalPedido += totalItem;

      return {
        id: item.id,
        product_id: item.produto.id,
        product_name: item.produto.nome,
        unit_price: unitPrice,
        quantity: item.quantidade,
        category: {
          id: item.produto.categoriaId,
          name: item.produto.categoriaNome,
          sub_category: {
            id: item.produto.subcategoriaId,
            name: item.produto.subcategoriaNome,
          },
        },
        total: totalItem,
      };
    });

    return {
      uuid: pedido.uuid,
      created_at: pedido.dataCriacaoMarketplace,
      channel: pedido.channel,
      total: Number(totalPedido.toFixed(2)),
      status: statusFromPrisma[pedido.status] ?? String(pedido.status).toLowerCase(),
      customer: {
        id: pedido.cliente?.id,
        name: pedido.cliente?.nome,
        email: pedido.cliente?.email,
        document: pedido.cliente?.document,
      },
      seller: pedido.seller
        ? {
            id: pedido.seller.id || null,
            name: pedido.seller.name || '',
            city: pedido.seller.city || '',
            state: pedido.seller.state || '',
          }
        : null,
      items,
      shipment: pedido.shipment
        ? {
            carrier: pedido.shipment.carrier || '',
            service: pedido.shipment.service || '',
            status: pedido.shipment.status || '',
            tracking_code: pedido.shipment.tracking_code || '',
          }
        : null,
      payment: pedido.payment,
      metadata: pedido.metadata
        ? {
            source: pedido.metadata.source || '',
            user_agent: pedido.metadata.user_agent || '',
            ip_address: pedido.metadata.ip_address || '',
          }
        : null,
      indexed_at: pedido.dataIndexacao,
    };
  }

  async salvarOuAtualizarCliente(tx, dto) {
    const nome = dto.customer.name ?? `Cliente ${dto.customer.id}`;
    const email = dto.customer.email ?? `cliente${dto.customer.id}@sem-email.local`;
    const document = dto.customer.document ?? null;

    return tx.cliente.upsert({
      where: { id: dto.customer.id },
      create: {
        id: dto.customer.id,
        nome,
        email,
        document,
      },
      update: {
        nome,
        email,
        document,
      },
    });
  }

  async salvarOuAtualizarProduto(tx, item) {
    const nome = item.product_name ?? `Produto ${item.product_id}`;
    const categoriaId = item.category?.id ?? null;
    const categoriaNome = item.category?.name ?? null;
    const subcategoriaId = item.category?.sub_category?.id ?? null;
    const subcategoriaNome = item.category?.sub_category?.name ?? null;

    return tx.produto.upsert({
      where: { id: item.product_id },
      create: {
        id: item.product_id,
        nome,
        categoriaId,
        categoriaNome,
        subcategoriaId,
        subcategoriaNome,
      },
      update: {
        nome,
        categoriaId,
        categoriaNome,
        subcategoriaId,
        subcategoriaNome,
      },
    });
  }
}

export const pedidoService = new PedidoService();
