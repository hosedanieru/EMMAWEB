-- Recrea el tipo Role para que el orden físico en Postgres sea
-- ADMIN, FACTURACION, EDITOR, VIEWER (Postgres no permite reordenar
-- valores existentes de un enum in-place).

-- 1. Crear el tipo nuevo con el orden deseado
CREATE TYPE "Role_new" AS ENUM ('ADMIN', 'FACTURACION', 'EDITOR', 'VIEWER');

-- 2. Quitar el default (referencia al tipo viejo) antes de castear la columna
ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;

-- 3. Migrar la columna al tipo nuevo, preservando los valores existentes
ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");

-- 4. Eliminar el tipo viejo y renombrar el nuevo para que ocupe su lugar
DROP TYPE "Role";
ALTER TYPE "Role_new" RENAME TO "Role";

-- 5. Restaurar el default sobre el tipo ya renombrado
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'EDITOR';
