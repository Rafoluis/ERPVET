/*
  Warnings:

  - You are about to drop the column `tipo_empleado` on the `Empleado` table. All the data in the column will be lost.
  - You are about to drop the column `tipo_usuario` on the `Usuario` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Empleado" DROP COLUMN "tipo_empleado";

-- AlterTable
ALTER TABLE "Usuario" DROP COLUMN "tipo_usuario";

-- DropEnum
DROP TYPE "TipoEmpleado";

-- DropEnum
DROP TYPE "TipoUsuario";

-- CreateTable
CREATE TABLE "Rol" (
    "id_rol" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Rol_pkey" PRIMARY KEY ("id_rol")
);

-- CreateTable
CREATE TABLE "UsuarioRol" (
    "id" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "id_rol" INTEGER NOT NULL,
    "fecha_asignacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UsuarioRol_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Rol_nombre_key" ON "Rol"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "UsuarioRol_id_usuario_id_rol_key" ON "UsuarioRol"("id_usuario", "id_rol");

-- AddForeignKey
ALTER TABLE "UsuarioRol" ADD CONSTRAINT "UsuarioRol_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsuarioRol" ADD CONSTRAINT "UsuarioRol_id_rol_fkey" FOREIGN KEY ("id_rol") REFERENCES "Rol"("id_rol") ON DELETE RESTRICT ON UPDATE CASCADE;
