import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { pedidoService } from './services/pedido.service.js';
import { iniciarConsumidorPedidos } from './consumers/pedido.consumer.js';
import { prisma } from './lib/prisma.js';

const app = express();

app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.get('/orders', async (req, res, next) => {
  try {
    const filtros = {
      page: Number(req.query.page ?? 1),
      limit: Number(req.query.limit ?? 10),
      codigoCliente: req.query.codigoCliente ? Number(req.query.codigoCliente) : undefined,
      produtoId: req.query.produtoId ? Number(req.query.produtoId) : undefined,
      status: req.query.status,
      sort: String(req.query.sort ?? 'desc').toLowerCase() === 'asc' ? 'asc' : 'desc',
    };

    const data = await pedidoService.findAll(filtros);
    res.json(data);
  } catch (error) {
    next(error);
  }
});

app.get('/orders/:uuid', async (req, res, next) => {
  try {
    const data = await pedidoService.findOne(req.params.uuid);
    res.json(data);
  } catch (error) {
    next(error);
  }
});

app.use((error, _req, res, _next) => {
  const status = error.statusCode ?? 500;
  res.status(status).json({
    message: error.message ?? 'Erro interno no servidor',
  });
});

const port = Number(process.env.PORT ?? 3000);

const server = app.listen(port, async () => {
  await prisma.$connect();
  iniciarConsumidorPedidos();
  console.log(`API rodando na porta ${port}`);
});

const shutdown = async () => {
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
