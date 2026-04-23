# at-mensageria2

Implementacao simples com Node.js + Express + Prisma + Postgres.

## Rotas

- GET /orders
- GET /orders/:uuid

## Filtros aceitos em GET /orders

- page
- limit
- codigoCliente
- produtoId
- status
- sort (asc ou desc)

## Rodar local

1. Suba o banco:

```bash
docker compose up -d
```

1. Crie .env com base no .env.example.

1. Instale dependencias:

```bash
npm install
```

1. Gere o client Prisma:

```bash
npm run prisma:generate
```

1. Crie as tabelas:

```bash
npm run prisma:migrate -- --name init
```

1. Rode seed:

```bash
npm run seed
```

1. Suba API:

```bash
npm run dev
```

## Observacao Pub/Sub

O consumidor eh opcional. Para ativar, configure:

- GOOGLE_CLOUD_PROJECT
- GOOGLE_APPLICATION_CREDENTIALS
- PUBSUB_SUBSCRIPTION_NAME
- PUBSUB_EMULATOR_HOST (opcional)

## Rotas

1. Consultar pedidos:
```
GET /orders
```
2. Consultar pedido por uuid:
```
GET /orders/ORD-2025-0001
```
3. Consultar pedido por id do cliente:
```
GET /orders?codigoCliente=7788
```
4. Consultar pedido por id do produto:
```
GET /orders?produtoId=9001
```
5. Consultar pedido por status do pedido (created,paid,shipped,delivered,canceled):
```
GET /orders?status=created
```