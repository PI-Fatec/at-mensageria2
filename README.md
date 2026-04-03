# at-mensageria2

Implementacao basica de ingestao e consulta de pedidos com NestJS + TypeORM + Postgres.

## O que foi implementado

- Persistencia relacional com tabelas:
- pedido
- cliente
- produto
- item_pedido
- Registro de hora de indexacao do pedido na base (`indexed_at` no payload de resposta).
- Consumidor basico manual (sem assinatura real de Pub/Sub), via rota:
- `POST /orders/ingest-manual`
- API de consulta:
- `GET /orders` com paginacao, ordenacao por data e filtros
- `GET /orders/{uuid}`
- Filtros suportados em `GET /orders`:
- `codigoCliente`
- `produtoId`
- `status`
- `page`
- `limit`
- Regras de calculo:
- total do pedido
- total de cada item

## Pendencias intencionais (escopo combinado)

- Nao foi implementada a configuracao real do Pub/Sub (subscription, auth, ack/nack).
- Nao foi implementada suite de testes automatizados.

## Executar localmente

1. Subir banco:

```bash
docker compose up -d
```

2. Criar arquivo `.env` a partir de `.env.example`.

3. Instalar dependencias:

```bash
npm install
```

4. Rodar aplicacao:

```bash
npm run start:dev
```

## Demonstracao rapida

1. Ingerir pedido manualmente:

```http
POST /orders/ingest-manual
Content-Type: application/json

{
 "uuid": "ORD-2025-0001",
 "created_at": "2025-10-01T10:15:00Z",
 "channel": "mobile_app",
 "status": "created",
 "customer": {
  "id": 7788,
  "name": "Maria Oliveira",
  "email": "maria@email.com",
  "document": "987.654.321-00"
 },
 "items": [
  {
   "product_id": 9001,
   "product_name": "Smartphone X",
   "unit_price": 2500.00,
   "quantity": 2,
   "category": {
    "id": "ELEC",
    "name": "Eletronicos",
    "sub_category": {
     "id": "PHONE",
     "name": "Smartphones"
    }
   }
  }
 ],
 "seller": {
  "id": 55,
  "name": "Tech Store",
  "city": "Sao Paulo",
  "state": "SP"
 },
 "shipment": {
  "carrier": "Correios",
  "service": "SEDEX",
  "status": "shipped",
  "tracking_code": "BR123456789"
 },
 "payment": {
  "method": "pix",
  "status": "approved",
  "transaction_id": "pay_987654321"
 },
 "metadata": {
  "source": "app",
  "user_agent": "Mozilla/5.0",
  "ip_address": "10.0.0.1"
 }
}
```

2. Consultar pedidos:

```http
GET /orders?page=1&limit=10&codigoCliente=7788&status=created
```

3. Consultar pedido por uuid:

```http
GET /orders/ORD-2025-0001
```

## Entregaveis academicos

- Demonstracao do projeto funcionando: feita pelos endpoints acima.
- DER do banco: arquivo em `docs/Diagram.png`.
- Fontes no git: este repositorio.
- Commit de todos os membros: checklist deve ser validado no historico do repositorio antes da entrega.
