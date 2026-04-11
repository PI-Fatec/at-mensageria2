import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PedidoService } from './pedido.service.js';
import { Pedido } from './entities/pedido.entity.js';
import { Cliente } from './entities/cliente.entity.js';
import { Produto } from './entities/produto.entity.js';
import { ItemPedido } from './entities/item-pedido.js';

describe('PedidoService', () => {
  let service;

  const mockRepo = {
    findOne: jest.fn(),
    findOneOrFail: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        PedidoService,
        { provide: getRepositoryToken(Pedido), useValue: mockRepo },
        { provide: getRepositoryToken(Cliente), useValue: mockRepo },
        { provide: getRepositoryToken(Produto), useValue: mockRepo },
        { provide: getRepositoryToken(ItemPedido), useValue: mockRepo },
      ],
    }).compile();

    service = module.get(PedidoService);
    jest.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });
});