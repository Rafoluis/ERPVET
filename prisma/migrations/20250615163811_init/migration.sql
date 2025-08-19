/*
  Warnings:

  - A unique constraint covering the columns `[dni]` on the table `Propietario` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `dni` to the `Propietario` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Propietario" ADD COLUMN     "dni" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Propietario_dni_key" ON "Propietario"("dni");
