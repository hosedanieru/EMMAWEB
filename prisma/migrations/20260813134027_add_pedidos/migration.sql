-- CreateTable
CREATE TABLE "Pedido" (
    "id" TEXT NOT NULL,
    "referencia" TEXT,
    "nombreCliente" TEXT NOT NULL,
    "correoCliente" TEXT NOT NULL,
    "telefonoCliente" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "ciudad" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'pendiente',
    "total" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pedido_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemPedido" (
    "id" TEXT NOT NULL,
    "pedidoId" TEXT NOT NULL,
    "presentacionId" TEXT NOT NULL,
    "nombreProducto" TEXT NOT NULL,
    "etiqueta" TEXT NOT NULL,
    "precioUnitario" DECIMAL(65,30) NOT NULL,
    "cantidad" INTEGER NOT NULL,

    CONSTRAINT "ItemPedido_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Pedido_referencia_key" ON "Pedido"("referencia");

-- AddForeignKey
ALTER TABLE "ItemPedido" ADD CONSTRAINT "ItemPedido_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "Pedido"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
