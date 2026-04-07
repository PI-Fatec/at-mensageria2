import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PedidoService } from './pedido.service';
import { Pedido } from './entities/pedido.entity';
import { Cliente } from './entities/cliente.entity';
import { Produto } from './entities/produto.entity';
import { ItemPedido } from './entities/item-pedido';
import { StatusPedido } from './dto/get-pedidos-filter.dto';

describe('PedidoService', () => {
  let service: PedidoService;

  const pedidoRepository = {
    findOne: jest.fn(),
    findOneOrFail: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  const clienteRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const produtoRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const itemPedidoRepository = {
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PedidoService,
        { provide: getRepositoryToken(Pedido), useValue: pedidoRepository },
        { provide: getRepositoryToken(Cliente), useValue: clienteRepository },
        { provide: getRepositoryToken(Produto), useValue: produtoRepository },
        { provide: getRepositoryToken(ItemPedido), useValue: itemPedidoRepository },
      ],
    }).compile();

    service = module.get<PedidoService>(PedidoService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should format a persisted order on findOne', async () => {
    pedidoRepository.findOne.mockResolvedValue({
      uuid: 'ORD-2025-0001',
      data_criacao_marketplace: new Date('2025-10-01T10:15:00Z'),
      data_indexacao: new Date('2025-10-01T10:16:00Z'),
      channel: 'mobile_app',
      status: StatusPedido.CREATED,
      seller: { id: 55, name: 'Tech Store', city: 'Sao Paulo', state: 'SP' },
      shipment: { carrier: 'Correios' },
      payment: { method: 'pix' },
      metadata: { source: 'app' },
      cliente: {
        id: 7788,
        nome: 'Maria Oliveira',
        email: 'maria@email.com',
        document: '987.654.321-00',
      },
      itens: [
        {
          id: 1,
          quantidade: 2,
          preco_unitario: 2500,
          produto: {
            id: 9001,
            nome: 'Smartphone X',
            categoria_id: 'ELEC',
            categoria_nome: 'Eletronicos',
            subcategoria_id: 'PHONE',
            subcategoria_nome: 'Smartphones',
          },
        },
      ],
    });

    const result = await service.findOne('ORD-2025-0001');

    expect(result.total).toBe(5000);
    expect(result.items[0].total).toBe(5000);
    expect(result.customer.id).toBe(7788);
    expect(result.uuid).toBe('ORD-2025-0001');
  });
});
