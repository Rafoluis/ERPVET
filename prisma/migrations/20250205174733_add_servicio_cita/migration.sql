/*
  Warnings:

  - You are about to drop the column `id_servicio` on the `Cita` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Cita" DROP CONSTRAINT "Cita_id_servicio_fkey";

-- AlterTable
ALTER TABLE "Cita" DROP COLUMN "id_servicio";

-- CreateTable
CREATE TABLE "ServicioCita" (
    "id_cita" INTEGER NOT NULL,
    "id_servicio" INTEGER NOT NULL,

    CONSTRAINT "ServicioCita_pkey" PRIMARY KEY ("id_cita","id_servicio")
);

-- AddForeignKey
ALTER TABLE "ServicioCita" ADD CONSTRAINT "ServicioCita_id_cita_fkey" FOREIGN KEY ("id_cita") REFERENCES "Cita"("id_cita") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServicioCita" ADD CONSTRAINT "ServicioCita_id_servicio_fkey" FOREIGN KEY ("id_servicio") REFERENCES "Servicio"("id_servicio") ON DELETE RESTRICT ON UPDATE CASCADE;
