-- CreateEnum
CREATE TYPE "Sexo" AS ENUM ('MASCULINO', 'FEMENINO');

-- CreateEnum
CREATE TYPE "TipoRol" AS ENUM ('ADMIN', 'VETERINARIO', 'PACIENTE', 'RECEPCIONISTA');

-- CreateTable
CREATE TABLE "Usuario" (
    "idUsuario" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "dni" TEXT NOT NULL,
    "sexo" "Sexo" NOT NULL,
    "email" TEXT,
    "telefono" TEXT NOT NULL DEFAULT '',
    "direccion" TEXT,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "password" TEXT NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("idUsuario")
);

-- CreateTable
CREATE TABLE "Rol" (
    "idRol" SERIAL NOT NULL,
    "nombre" "TipoRol" NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Rol_pkey" PRIMARY KEY ("idRol")
);

-- CreateTable
CREATE TABLE "UsuarioRol" (
    "idUsuarioRol" SERIAL NOT NULL,
    "idUsuario" INTEGER NOT NULL,
    "idRol" INTEGER NOT NULL,
    "fechaAsignacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "UsuarioRol_pkey" PRIMARY KEY ("idUsuarioRol")
);

-- CreateTable
CREATE TABLE "Empleado" (
    "idEmpleado" SERIAL NOT NULL,
    "idUsuario" INTEGER NOT NULL,
    "especialidad" TEXT NOT NULL,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Empleado_pkey" PRIMARY KEY ("idEmpleado")
);

-- CreateTable
CREATE TABLE "Propietario" (
    "idPropietario" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "correo" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "direccion" TEXT,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Propietario_pkey" PRIMARY KEY ("idPropietario")
);

-- CreateTable
CREATE TABLE "Mascota" (
    "idMascota" SERIAL NOT NULL,
    "idPropietario" INTEGER NOT NULL,
    "nombre" TEXT NOT NULL,
    "especie" TEXT NOT NULL,
    "raza" TEXT,
    "sexo" "Sexo" NOT NULL,
    "fechaNacimiento" TIMESTAMP(3) NOT NULL,
    "peso" DOUBLE PRECISION,
    "numeroChip" TEXT,
    "esterilizado" BOOLEAN NOT NULL DEFAULT false,
    "alergias" TEXT,
    "notasComportamiento" TEXT,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Mascota_pkey" PRIMARY KEY ("idMascota")
);

-- CreateTable
CREATE TABLE "HistoriaClinica" (
    "idHistoriaClinica" SERIAL NOT NULL,
    "idMascota" INTEGER NOT NULL,
    "anamnesis" TEXT NOT NULL,
    "examenFisico" TEXT NOT NULL,
    "diagnostico" TEXT NOT NULL,
    "planTratamiento" TEXT NOT NULL,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "urlfoto" TEXT,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "HistoriaClinica_pkey" PRIMARY KEY ("idHistoriaClinica")
);

-- CreateTable
CREATE TABLE "AdjuntoHistoria" (
    "idAdjuntosHistoria" SERIAL NOT NULL,
    "idHistoriaClinica" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "descripcion" TEXT,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "AdjuntoHistoria_pkey" PRIMARY KEY ("idAdjuntosHistoria")
);

-- CreateTable
CREATE TABLE "RegistroVacunacion" (
    "idRegistroVacuna" SERIAL NOT NULL,
    "idMascota" INTEGER NOT NULL,
    "nombreVacuna" TEXT NOT NULL,
    "fechaAdministracion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaProxima" TIMESTAMP(3),
    "lote" TEXT,
    "veterinario" TEXT,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "RegistroVacunacion_pkey" PRIMARY KEY ("idRegistroVacuna")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_dni_key" ON "Usuario"("dni");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Rol_nombre_key" ON "Rol"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "UsuarioRol_idUsuario_idRol_key" ON "UsuarioRol"("idUsuario", "idRol");

-- CreateIndex
CREATE UNIQUE INDEX "Empleado_idUsuario_key" ON "Empleado"("idUsuario");

-- CreateIndex
CREATE UNIQUE INDEX "Propietario_correo_key" ON "Propietario"("correo");

-- CreateIndex
CREATE UNIQUE INDEX "Mascota_numeroChip_key" ON "Mascota"("numeroChip");

-- CreateIndex
CREATE UNIQUE INDEX "HistoriaClinica_idMascota_key" ON "HistoriaClinica"("idMascota");

-- AddForeignKey
ALTER TABLE "UsuarioRol" ADD CONSTRAINT "UsuarioRol_idUsuario_fkey" FOREIGN KEY ("idUsuario") REFERENCES "Usuario"("idUsuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsuarioRol" ADD CONSTRAINT "UsuarioRol_idRol_fkey" FOREIGN KEY ("idRol") REFERENCES "Rol"("idRol") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Empleado" ADD CONSTRAINT "Empleado_idUsuario_fkey" FOREIGN KEY ("idUsuario") REFERENCES "Usuario"("idUsuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mascota" ADD CONSTRAINT "Mascota_idPropietario_fkey" FOREIGN KEY ("idPropietario") REFERENCES "Propietario"("idPropietario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistoriaClinica" ADD CONSTRAINT "HistoriaClinica_idMascota_fkey" FOREIGN KEY ("idMascota") REFERENCES "Mascota"("idMascota") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdjuntoHistoria" ADD CONSTRAINT "AdjuntoHistoria_idHistoriaClinica_fkey" FOREIGN KEY ("idHistoriaClinica") REFERENCES "HistoriaClinica"("idHistoriaClinica") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegistroVacunacion" ADD CONSTRAINT "RegistroVacunacion_idMascota_fkey" FOREIGN KEY ("idMascota") REFERENCES "Mascota"("idMascota") ON DELETE RESTRICT ON UPDATE CASCADE;
