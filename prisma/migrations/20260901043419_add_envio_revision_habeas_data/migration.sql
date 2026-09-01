-- AlterTable
ALTER TABLE "Pedido" ADD COLUMN     "autorizaDatosEn" TIMESTAMP(3),
ADD COLUMN     "costoEnvio" DECIMAL(65,30) NOT NULL DEFAULT 0,
ADD COLUMN     "motivoRevision" TEXT,
ADD COLUMN     "requiereRevision" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "subtotal" DECIMAL(65,30) NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "Pedido_estado_pagadoEn_idx" ON "Pedido"("estado", "pagadoEn");

-- CreateIndex
CREATE INDEX "Pedido_pagadoEn_idx" ON "Pedido"("pagadoEn");

-- CreateIndex
CREATE INDEX "Pedido_requiereRevision_idx" ON "Pedido"("requiereRevision");
