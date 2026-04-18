-- CreateEnum
CREATE TYPE "pedido_status_enum" AS ENUM ('created', 'confirmed', 'pending', 'paid', 'shipped', 'separated', 'delivered', 'canceled', 'cancelled');

-- CreateTable
CREATE TABLE "cliente" (
    "id" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "document" TEXT,

    CONSTRAINT "cliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "produto" (
    "id" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "categoria_id" TEXT,
    "categoria_nome" TEXT,
    "subcategoria_id" TEXT,
    "subcategoria_nome" TEXT,

    CONSTRAINT "produto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pedido" (
    "uuid" VARCHAR(120) NOT NULL,
    "status" "pedido_status_enum" NOT NULL,
    "channel" VARCHAR(100),
    "data_criacao_marketplace" TIMESTAMP(3) NOT NULL,
    "data_indexacao" TIMESTAMP(3) NOT NULL,
    "seller" JSONB,
    "shipment" JSONB,
    "payment" JSONB,
    "metadata" JSONB,
    "cliente_id" INTEGER,

    CONSTRAINT "pedido_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "item_pedido" (
    "id" SERIAL NOT NULL,
    "preco_unitario" DECIMAL(10,2) NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "pedido_uuid" VARCHAR(120) NOT NULL,
    "produto_id" INTEGER NOT NULL,

    CONSTRAINT "item_pedido_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cliente_email_key" ON "cliente"("email");

-- CreateIndex
CREATE INDEX "pedido_cliente_id_idx" ON "pedido"("cliente_id");

-- CreateIndex
CREATE INDEX "item_pedido_pedido_uuid_idx" ON "item_pedido"("pedido_uuid");

-- CreateIndex
CREATE INDEX "item_pedido_produto_id_idx" ON "item_pedido"("produto_id");

-- AddForeignKey
ALTER TABLE "pedido" ADD CONSTRAINT "pedido_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "cliente"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_pedido" ADD CONSTRAINT "item_pedido_pedido_uuid_fkey" FOREIGN KEY ("pedido_uuid") REFERENCES "pedido"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_pedido" ADD CONSTRAINT "item_pedido_produto_id_fkey" FOREIGN KEY ("produto_id") REFERENCES "produto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
