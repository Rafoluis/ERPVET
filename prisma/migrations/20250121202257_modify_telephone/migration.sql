/*
  Warnings:

  - Made the column `telefono` on table `Usuario` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "Usuario_telefono_key";

-- AlterTable
ALTER TABLE "Usuario" ALTER COLUMN "telefono" SET NOT NULL,
ALTER COLUMN "telefono" SET DEFAULT '';
