/*
  Warnings:

  - The values [ADMIN,PACIENTE,RECEPCIONISTA] on the enum `TipoRol` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "TipoRol_new" AS ENUM ('VETERINARIO');
ALTER TABLE "Rol" ALTER COLUMN "nombre" TYPE "TipoRol_new" USING ("nombre"::text::"TipoRol_new");
ALTER TYPE "TipoRol" RENAME TO "TipoRol_old";
ALTER TYPE "TipoRol_new" RENAME TO "TipoRol";
DROP TYPE "TipoRol_old";
COMMIT;
