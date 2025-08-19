/*
  Warnings:

  - You are about to drop the column `anamnesis` on the `HistoriaClinica` table. All the data in the column will be lost.
  - You are about to drop the column `diagnostico` on the `HistoriaClinica` table. All the data in the column will be lost.
  - You are about to drop the column `examenFisico` on the `HistoriaClinica` table. All the data in the column will be lost.
  - You are about to drop the column `planTratamiento` on the `HistoriaClinica` table. All the data in the column will be lost.
  - Added the required column `alimentacion` to the `HistoriaClinica` table without a default value. This is not possible if the table is not empty.
  - Added the required column `color` to the `HistoriaClinica` table without a default value. This is not possible if the table is not empty.
  - Added the required column `comportamiento` to the `HistoriaClinica` table without a default value. This is not possible if the table is not empty.
  - Added the required column `convivencia` to the `HistoriaClinica` table without a default value. This is not possible if the table is not empty.
  - Added the required column `enfermedadPrevia` to the `HistoriaClinica` table without a default value. This is not possible if the table is not empty.
  - Added the required column `finZootecnico` to the `HistoriaClinica` table without a default value. This is not possible if the table is not empty.
  - Added the required column `habitad` to the `HistoriaClinica` table without a default value. This is not possible if the table is not empty.
  - Added the required column `origenProcedencia` to the `HistoriaClinica` table without a default value. This is not possible if the table is not empty.
  - Added the required column `partos` to the `HistoriaClinica` table without a default value. This is not possible if the table is not empty.
  - Added the required column `señalesParticulares` to the `HistoriaClinica` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tamaño` to the `HistoriaClinica` table without a default value. This is not possible if the table is not empty.
  - Added the required column `viajesRecientes` to the `HistoriaClinica` table without a default value. This is not possible if the table is not empty.
  - Added the required column `viveConAnimales` to the `HistoriaClinica` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `dni` on the `Propietario` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('CIRUGIA_ESTERILIZACION', 'CHEQUEO_SEGUIMIENTO', 'CONSULTA_INICIAL');

-- DropIndex
DROP INDEX "Propietario_dni_key";

-- AlterTable
ALTER TABLE "HistoriaClinica" DROP COLUMN "anamnesis",
DROP COLUMN "diagnostico",
DROP COLUMN "examenFisico",
DROP COLUMN "planTratamiento",
ADD COLUMN     "alimentacion" TEXT NOT NULL,
ADD COLUMN     "color" TEXT NOT NULL,
ADD COLUMN     "comportamiento" TEXT NOT NULL,
ADD COLUMN     "convivencia" TEXT NOT NULL,
ADD COLUMN     "enfermedadPrevia" TEXT NOT NULL,
ADD COLUMN     "finZootecnico" TEXT NOT NULL,
ADD COLUMN     "habitad" TEXT NOT NULL,
ADD COLUMN     "origenProcedencia" TEXT NOT NULL,
ADD COLUMN     "partos" INTEGER NOT NULL,
ADD COLUMN     "señalesParticulares" TEXT NOT NULL,
ADD COLUMN     "tamaño" TEXT NOT NULL,
ADD COLUMN     "viajesRecientes" TEXT NOT NULL,
ADD COLUMN     "viveConAnimales" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "Propietario" DROP COLUMN "dni",
ADD COLUMN     "dni" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "EnfermedadPrevia" (
    "id" SERIAL NOT NULL,
    "idHistoriaClinica" INTEGER NOT NULL,
    "descripcion" TEXT NOT NULL,
    "fecha" TIMESTAMP(3),

    CONSTRAINT "EnfermedadPrevia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CirugiaPrevia" (
    "id" SERIAL NOT NULL,
    "idHistoriaClinica" INTEGER NOT NULL,
    "descripcion" TEXT NOT NULL,
    "fecha" TIMESTAMP(3),

    CONSTRAINT "CirugiaPrevia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TratamientoReciente" (
    "id" SERIAL NOT NULL,
    "idHistoriaClinica" INTEGER NOT NULL,
    "descripcion" TEXT NOT NULL,
    "fechaInicio" TIMESTAMP(3),
    "fechaFin" TIMESTAMP(3),

    CONSTRAINT "TratamientoReciente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LineaTiempo" (
    "id" SERIAL NOT NULL,
    "idHistoriaClinica" INTEGER NOT NULL,
    "tipo" "EventType" NOT NULL,
    "titulo" TEXT NOT NULL,
    "ubicacion" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "detalles" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "LineaTiempo_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "EnfermedadPrevia" ADD CONSTRAINT "EnfermedadPrevia_idHistoriaClinica_fkey" FOREIGN KEY ("idHistoriaClinica") REFERENCES "HistoriaClinica"("idHistoriaClinica") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CirugiaPrevia" ADD CONSTRAINT "CirugiaPrevia_idHistoriaClinica_fkey" FOREIGN KEY ("idHistoriaClinica") REFERENCES "HistoriaClinica"("idHistoriaClinica") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TratamientoReciente" ADD CONSTRAINT "TratamientoReciente_idHistoriaClinica_fkey" FOREIGN KEY ("idHistoriaClinica") REFERENCES "HistoriaClinica"("idHistoriaClinica") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LineaTiempo" ADD CONSTRAINT "LineaTiempo_idHistoriaClinica_fkey" FOREIGN KEY ("idHistoriaClinica") REFERENCES "HistoriaClinica"("idHistoriaClinica") ON DELETE RESTRICT ON UPDATE CASCADE;
