-- AlterTable
ALTER TABLE "Pedido" ADD COLUMN     "datosPago" JSONB,
ADD COLUMN     "metodoPago" TEXT,
ADD COLUMN     "pagadoEn" TIMESTAMP(3),
ADD COLUMN     "wompiTransactionId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Pedido_wompiTransactionId_key" ON "Pedido"("wompiTransactionId");
