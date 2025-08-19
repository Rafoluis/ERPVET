/*
  Warnings:

  - You are about to drop the column `urlfoto` on the `HistoriaClinica` table. All the data in the column will be lost.
  - Changed the type of `sexo` on the `Mascota` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "SexoMascot" AS ENUM ('MACHO', 'HEMBRA');

-- AlterTable
ALTER TABLE "HistoriaClinica" DROP COLUMN "urlfoto";

-- AlterTable
ALTER TABLE "Mascota" ADD COLUMN     "urlfoto" TEXT,
DROP COLUMN "sexo",
ADD COLUMN     "sexo" "SexoMascot" NOT NULL;
