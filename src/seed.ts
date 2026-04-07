import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PedidoService } from './pedido/pedido.service';
import { CreatePedidoDto } from './pedido/dto/create-pedido.dto';
import { StatusPedido } from './pedido/dto/get-pedidos-filter.dto';

const pedidosPadrao: CreatePedidoDto[] = [
  {
    uuid: 'ORD-2025-0001',
    created_at: '2025-10-01T10:15:00Z',
    channel: 'mobile_app',
    status: StatusPedido.CREATED,
    customer: {
      id: 7788,
      name: 'Maria Oliveira',
      email: 'maria@email.com',
      document: '987.654.321-00',
    },
    seller: {
      id: 55,
      name: 'Tech Store',
      city: 'Sao Paulo',
      state: 'SP',
    },
    items: [
      {
        product_id: 9001,
        product_name: 'Smartphone X',
        unit_price: 2500,
        quantity: 2,
        category: {
          id: 'ELEC',
          name: 'Eletronicos',
          sub_category: {
            id: 'PHONE',
            name: 'Smartphones',
          },
        },
      },
    ],
    shipment: {
      carrier: 'Correios',
      service: 'SEDEX',
      status: 'shipped',
      tracking_code: 'BR123456789',
    },
    payment: {
      method: 'pix',
      status: 'approved',
      transaction_id: 'pay_987654321',
    },
    metadata: {
      source: 'app',
      user_agent: 'Mozilla/5.0',
      ip_address: '10.0.0.1',
    },
  },
  {
    uuid: 'ORD-2025-0002',
    created_at: '2025-10-02T14:30:00Z',
    channel: 'web',
    status: StatusPedido.PAID,
    customer: {
      id: 49494,
      name: 'Joao Mendes',
      email: 'joao@email.com',
      document: '123.456.789-10',
    },
    seller: {
      id: 77,
      name: 'Home Store',
      city: 'Campinas',
      state: 'SP',
    },
    items: [
      {
        product_id: 7001,
        product_name: 'Cafeteira Inox',
        unit_price: 399.9,
        quantity: 1,
        category: {
          id: 'HOME',
          name: 'Casa',
          sub_category: {
            id: 'KITCHEN',
            name: 'Cozinha',
          },
        },
      },
      {
        product_id: 7002,
        product_name: 'Kit Canecas',
        unit_price: 59.9,
        quantity: 2,
        category: {
          id: 'HOME',
          name: 'Casa',
          sub_category: {
            id: 'DINNER',
            name: 'Mesa',
          },
        },
      },
    ],
    shipment: {
      carrier: 'Jadlog',
      service: 'Expresso',
      status: 'processing',
      tracking_code: 'JD000000111BR',
    },
    payment: {
      method: 'credit_card',
      status: 'approved',
      transaction_id: 'pay_123456789',
    },
    metadata: {
      source: 'site',
      user_agent: 'Mozilla/5.0 (Macintosh)',
      ip_address: '10.0.0.2',
    },
  },
  {
    uuid: 'ORD-2025-0003',
    created_at: '2025-10-03T09:45:00Z',
    channel: 'marketplace_partner',
    status: StatusPedido.DELIVERED,
    customer: {
      id: 8899,
      name: 'Ana Souza',
      email: 'ana@email.com',
      document: '555.444.333-22',
    },
    seller: {
      id: 91,
      name: 'Fitness Shop',
      city: 'Belo Horizonte',
      state: 'MG',
    },
    items: [
      {
        product_id: 8801,
        product_name: 'Smartwatch Fit',
        unit_price: 799.5,
        quantity: 1,
        category: {
          id: 'ELEC',
          name: 'Eletronicos',
          sub_category: {
            id: 'WEAR',
            name: 'Wearables',
          },
        },
      },
      {
        product_id: 8802,
        product_name: 'Fone Bluetooth',
        unit_price: 199.9,
        quantity: 1,
        category: {
          id: 'ELEC',
          name: 'Eletronicos',
          sub_category: {
            id: 'AUDIO',
            name: 'Audio',
          },
        },
      },
    ],
    shipment: {
      carrier: 'Correios',
      service: 'PAC',
      status: 'delivered',
      tracking_code: 'BR555444333',
    },
    payment: {
      method: 'boleto',
      status: 'approved',
      transaction_id: 'pay_444555666',
    },
    metadata: {
      source: 'partner',
      user_agent: 'MarketplaceBot/1.0',
      ip_address: '10.0.0.3',
    },
  },
];

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  try {
    const pedidoService = app.get(PedidoService);

    for (const pedido of pedidosPadrao) {
      await pedidoService.salvarPedidoDoMarketplace(pedido);
    }

    console.log(`Seed concluido com ${pedidosPadrao.length} pedidos padrao.`);
  } finally {
    await app.close();
  }
}

void bootstrap();
