-- CreateEnum
CREATE TYPE "Sexo" AS ENUM ('MASCULINO', 'FEMENINO');

-- CreateEnum
CREATE TYPE "EstadoCita" AS ENUM ('AGENDADO', 'COMPLETADO', 'EN_PROCESO', 'FINALIZADO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "TipoEmpleado" AS ENUM ('RECEPCIONISTA', 'ODONTOLOGO');

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "usernames" TEXT NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Paciente" (
    "id_paciente" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "dni" TEXT NOT NULL,
    "sexo" "Sexo" NOT NULL,
    "fecha_nacimiento" TIMESTAMP(3) NOT NULL,
    "direccion" TEXT,
    "telefono" TEXT NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Paciente_pkey" PRIMARY KEY ("id_paciente")
);

-- CreateTable
CREATE TABLE "Servicio" (
    "id_servicio" SERIAL NOT NULL,
    "nombre_servicio" TEXT NOT NULL,
    "descripcion" TEXT,
    "tarifa" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Servicio_pkey" PRIMARY KEY ("id_servicio")
);

-- CreateTable
CREATE TABLE "Empleado" (
    "id_empleado" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "dni" TEXT NOT NULL,
    "sexo" "Sexo" NOT NULL,
    "especialidad" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "email" TEXT,
    "tipo_empleado" "TipoEmpleado" NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Empleado_pkey" PRIMARY KEY ("id_empleado")
);

-- CreateTable
CREATE TABLE "Cita" (
    "id_cita" SERIAL NOT NULL,
    "id_paciente" INTEGER NOT NULL,
    "id_empleado" INTEGER NOT NULL,
    "id_servicio" INTEGER NOT NULL,
    "fecha_cita" TIMESTAMP(3) NOT NULL,
    "hora_cita_inicial" TIMESTAMP(3) NOT NULL,
    "hora_cita_final" TIMESTAMP(3) NOT NULL,
    "estado" "EstadoCita" NOT NULL,

    CONSTRAINT "Cita_pkey" PRIMARY KEY ("id_cita")
);

-- CreateTable
CREATE TABLE "Ticket" (
    "id_ticket" SERIAL NOT NULL,
    "id_paciente" INTEGER NOT NULL,
    "fecha_emision" TIMESTAMP(3) NOT NULL,
    "tipo_comprobante" TEXT NOT NULL,
    "medio_pago" TEXT NOT NULL,
    "monto_total" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id_ticket")
);

-- CreateTable
CREATE TABLE "Pago" (
    "id_pago" SERIAL NOT NULL,
    "id_ticket" INTEGER NOT NULL,
    "monto" DOUBLE PRECISION NOT NULL,
    "fecha_pago" TIMESTAMP(3) NOT NULL,
    "medio_pago" TEXT NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pago_pkey" PRIMARY KEY ("id_pago")
);

-- CreateTable
CREATE TABLE "Historia_Clinica" (
    "id_historia" SERIAL NOT NULL,
    "id_paciente" INTEGER NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "antecedentes" TEXT,
    "tratamientos" TEXT,
    "medicamentos" TEXT,
    "observaciones" TEXT,

    CONSTRAINT "Historia_Clinica_pkey" PRIMARY KEY ("id_historia")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_usernames_key" ON "Admin"("usernames");

-- CreateIndex
CREATE UNIQUE INDEX "Paciente_dni_key" ON "Paciente"("dni");

-- CreateIndex
CREATE UNIQUE INDEX "Paciente_telefono_key" ON "Paciente"("telefono");

-- CreateIndex
CREATE UNIQUE INDEX "Empleado_dni_key" ON "Empleado"("dni");

-- CreateIndex
CREATE UNIQUE INDEX "Empleado_telefono_key" ON "Empleado"("telefono");

-- CreateIndex
CREATE UNIQUE INDEX "Empleado_email_key" ON "Empleado"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Historia_Clinica_id_paciente_key" ON "Historia_Clinica"("id_paciente");

-- AddForeignKey
ALTER TABLE "Cita" ADD CONSTRAINT "Cita_id_paciente_fkey" FOREIGN KEY ("id_paciente") REFERENCES "Paciente"("id_paciente") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cita" ADD CONSTRAINT "Cita_id_empleado_fkey" FOREIGN KEY ("id_empleado") REFERENCES "Empleado"("id_empleado") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cita" ADD CONSTRAINT "Cita_id_servicio_fkey" FOREIGN KEY ("id_servicio") REFERENCES "Servicio"("id_servicio") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_id_paciente_fkey" FOREIGN KEY ("id_paciente") REFERENCES "Paciente"("id_paciente") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pago" ADD CONSTRAINT "Pago_id_ticket_fkey" FOREIGN KEY ("id_ticket") REFERENCES "Ticket"("id_ticket") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Historia_Clinica" ADD CONSTRAINT "Historia_Clinica_id_paciente_fkey" FOREIGN KEY ("id_paciente") REFERENCES "Paciente"("id_paciente") ON DELETE RESTRICT ON UPDATE CASCADE;
