-- Esta migración reconstruye la tabla Vacante y su enum, que existían en la
-- base de desarrollo pero nunca tuvieron archivo de migración (se crearon con
-- `db push`). Sin ella, un `prisma migrate deploy` sobre una base limpia no
-- crea la tabla y el panel de vacantes falla al primer acceso.
--
-- En la base donde Vacante ya existe, esta migración se marca como aplicada
-- con `prisma migrate resolve --applied` en vez de ejecutarse.

-- CreateEnum
CREATE TYPE "TipoContrato" AS ENUM ('TIEMPO_COMPLETO', 'MEDIO_TIEMPO', 'TEMPORAL', 'PRACTICA');

-- CreateTable
CREATE TABLE "Vacante" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "area" TEXT NOT NULL,
    "ubicacion" TEXT NOT NULL,
    "tipo" "TipoContrato" NOT NULL DEFAULT 'TIEMPO_COMPLETO',
    "descripcion" TEXT NOT NULL,
    "activa" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vacante_pkey" PRIMARY KEY ("id")
);
