/*
  Warnings:

  - Changed the type of `nombre` on the `Rol` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "TipoRol" AS ENUM ('ADMIN', 'ODONTOLOGO', 'PACIENTE', 'RECEPCIONISTA');

-- AlterTable
ALTER TABLE "Rol" DROP COLUMN "nombre",
ADD COLUMN     "nombre" "TipoRol" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Rol_nombre_key" ON "Rol"("nombre");
