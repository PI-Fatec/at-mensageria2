# at-mensageria2

Implementacao basica de ingestao e consulta de pedidos com NestJS + TypeORM + Postgres.

## O que foi implementado

- Persistencia relacional com tabelas:
- pedido
- cliente
- produto
- item_pedido
- Registro de hora de indexacao do pedido na base (`indexed_at` no payload de resposta).
- Consumidor de pedidos preparado para Google Pub/Sub:
- assinatura opcional por variaveis de ambiente
- `ack/nack` quando a assinatura estiver configurada
- API de consulta:
- `GET /orders` com paginacao, ordenacao por data e filtros
- `GET /orders/{uuid}`
- Filtros suportados em `GET /orders`:
- `codigoCliente`
- `produtoId`
- `status`
- `sort` (`asc` ou `desc`)
- `page`
- `limit`
- Regras de calculo:
- total do pedido
- total de cada item

## Pendencias intencionais (escopo combinado)

- Falta apenas preencher as variaveis reais do Google Pub/Sub no ambiente para conectar a assinatura do projeto.
- Nao ha testes de integracao com banco e Pub/Sub real.

## Executar localmente

1. Subir banco:

```bash
docker compose up -d
```

2. Criar arquivo `.env` a partir de `.env.example`.

Se quiser deixar o Pub/Sub pronto para uso real, preencha tambem:

```env
GOOGLE_CLOUD_PROJECT=seu-projeto
GOOGLE_APPLICATION_CREDENTIALS=/caminho/credenciais.json
PUBSUB_SUBSCRIPTION_NAME=orders-subscription
PUBSUB_EMULATOR_HOST=
```

3. Instalar dependencias:

```bash
npm install
```

4. Rodar aplicacao:

```bash
npm run dev
```

5. Popular o banco com dados padrao:

```bash
npm run seed
```

## Demonstracao rapida

1. Popular o banco para demonstracao local:

```bash
npm run seed
```

2. Consultar pedidos:

```http
GET /orders?page=1&limit=10&codigoCliente=7788&status=created&sort=desc
```

3. Consultar pedido por uuid:

```http
GET /orders/ORD-2025-0001
```

## Entregaveis academicos

- Demonstracao do projeto funcionando: feita pelos endpoints acima e pela assinatura Pub/Sub quando configurada.
- DER do banco: arquivo em `docs/Diagram.png`.
- Fontes no git: este repositorio.
- Commit de todos os membros: checklist deve ser validado no historico do repositorio antes da entrega.

## Checklist de entrega

- [x] Persistencia relacional com tabelas `pedido`, `cliente`, `produto` e `item_pedido`
- [x] Registro da hora de indexacao na base (`indexed_at`)
- [x] API REST com `GET /orders` e `GET /orders/{uuid}`
- [x] Paginacao em `GET /orders`
- [x] Ordenacao por data
- [x] Filtros por `codigoCliente`, `produtoId` e `status`
- [x] Calculo dinamico do total do pedido
- [x] Calculo dinamico do total de cada item
- [x] Seed com dados padrao para demonstracao local
- [x] DER disponivel em `docs/Diagram.png`
- [ ] Configurar e demonstrar consumo real via Google Pub/Sub
- [ ] Validar commits de todos os membros no historico do git
