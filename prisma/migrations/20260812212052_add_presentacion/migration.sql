/*
  Warnings:

  - You are about to drop the column `precio` on the `Producto` table. All the data in the column will be lost.
  - You are about to drop the column `stock` on the `Producto` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Producto" DROP COLUMN "precio",
DROP COLUMN "stock";

-- CreateTable
CREATE TABLE "Presentacion" (
    "id" TEXT NOT NULL,
    "cantidad" DECIMAL(65,30) NOT NULL,
    "unidad" TEXT NOT NULL,
    "precio" DECIMAL(65,30) NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "productoId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Presentacion_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Presentacion" ADD CONSTRAINT "Presentacion_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
