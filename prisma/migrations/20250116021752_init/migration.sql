/*
  Warnings:

  - You are about to drop the column `apellido` on the `Empleado` table. All the data in the column will be lost.
  - You are about to drop the column `dni` on the `Empleado` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Empleado` table. All the data in the column will be lost.
  - You are about to drop the column `nombre` on the `Empleado` table. All the data in the column will be lost.
  - You are about to drop the column `sexo` on the `Empleado` table. All the data in the column will be lost.
  - You are about to drop the column `telefono` on the `Empleado` table. All the data in the column will be lost.
  - You are about to drop the column `apellido` on the `Paciente` table. All the data in the column will be lost.
  - You are about to drop the column `direccion` on the `Paciente` table. All the data in the column will be lost.
  - You are about to drop the column `dni` on the `Paciente` table. All the data in the column will be lost.
  - You are about to drop the column `nombre` on the `Paciente` table. All the data in the column will be lost.
  - You are about to drop the column `sexo` on the `Paciente` table. All the data in the column will be lost.
  - You are about to drop the column `telefono` on the `Paciente` table. All the data in the column will be lost.
  - You are about to drop the `Admin` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[id_usuario]` on the table `Empleado` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id_usuario]` on the table `Paciente` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `id_usuario` to the `Empleado` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_usuario` to the `Paciente` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TipoUsuario" AS ENUM ('ADMIN', 'PACIENTE', 'EMPLEADO');

-- DropIndex
DROP INDEX "Empleado_dni_key";

-- DropIndex
DROP INDEX "Empleado_email_key";

-- DropIndex
DROP INDEX "Empleado_telefono_key";

-- DropIndex
DROP INDEX "Paciente_dni_key";

-- DropIndex
DROP INDEX "Paciente_telefono_key";

-- AlterTable
ALTER TABLE "Empleado" DROP COLUMN "apellido",
DROP COLUMN "dni",
DROP COLUMN "email",
DROP COLUMN "nombre",
DROP COLUMN "sexo",
DROP COLUMN "telefono",
ADD COLUMN     "id_usuario" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Paciente" DROP COLUMN "apellido",
DROP COLUMN "direccion",
DROP COLUMN "dni",
DROP COLUMN "nombre",
DROP COLUMN "sexo",
DROP COLUMN "telefono",
ADD COLUMN     "id_usuario" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Admin";

-- CreateTable
CREATE TABLE "Usuario" (
    "id_usuario" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "dni" TEXT NOT NULL,
    "sexo" "Sexo" NOT NULL,
    "email" TEXT,
    "telefono" TEXT,
    "direccion" TEXT,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tipo_usuario" "TipoUsuario" NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_dni_key" ON "Usuario"("dni");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_telefono_key" ON "Usuario"("telefono");

-- CreateIndex
CREATE UNIQUE INDEX "Empleado_id_usuario_key" ON "Empleado"("id_usuario");

-- CreateIndex
CREATE UNIQUE INDEX "Paciente_id_usuario_key" ON "Paciente"("id_usuario");

-- AddForeignKey
ALTER TABLE "Paciente" ADD CONSTRAINT "Paciente_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Empleado" ADD CONSTRAINT "Empleado_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;
