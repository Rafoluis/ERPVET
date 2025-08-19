"use server";

import { RegistroVacunacionSchema } from "@/lib/formSchema";
import prisma from "@/lib/prisma";

type CurrentState = { success: boolean; error: string | null };

const formatDatePeru = (fecha: Date) => {
  return new Date(
    new Date(fecha).toLocaleString("sv-SE", { timeZone: "America/Lima" })
  );
};

export const createRegistroVacunacion = async (
  currentState: CurrentState,
  data: RegistroVacunacionSchema
) => {
  try {
    const fechaAdmin = data.fechaAdministracion
      ? formatDatePeru(data.fechaAdministracion)
      : undefined;
    const fechaProx = data.fechaProxima
      ? formatDatePeru(data.fechaProxima)
      : undefined;

    await prisma.registroVacunacion.create({
      data: {
        idMascota: data.idMascota,
        nombreVacuna: data.nombreVacuna,
        fechaAdministracion: fechaAdmin ?? undefined,
        fechaProxima: fechaProx,
        lote: data.lote ?? undefined,
        veterinario: data.veterinario ?? undefined,
      },
    });

    return { success: true, error: null };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Error al crear el registro de vacunación" };
  }
};

export const updateRegistroVacunacion = async (
  currentState: CurrentState,
  data: RegistroVacunacionSchema
) => {
  try {
    const fechaAdmin = data.fechaAdministracion
      ? formatDatePeru(data.fechaAdministracion)
      : undefined;
    const fechaProx = data.fechaProxima
      ? formatDatePeru(data.fechaProxima)
      : undefined;

    await prisma.registroVacunacion.update({
      where: { idRegistroVacuna: data.idRegistroVacuna },
      data: {
        idMascota: data.idMascota,
        nombreVacuna: data.nombreVacuna,
        fechaAdministracion: fechaAdmin,
        fechaProxima: fechaProx,
        lote: data.lote ?? undefined,
        veterinario: data.veterinario ?? undefined,
      },
    });

    return { success: true, error: null };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Error al actualizar el registro de vacunación" };
  }
};

export const deleteRegistroVacunacion = async (
  currentState: CurrentState,
  formData: FormData
) => {
  const id = formData.get("id") as string;
  const idRegistro = parseInt(id, 10);
  if (isNaN(idRegistro)) {
    return { success: false, error: "ID de registro inválido" };
  }

  try {
    await prisma.registroVacunacion.update({
      where: { idRegistroVacuna: idRegistro },
      data: { deletedAt: new Date() },
    });
    return { success: true, error: null };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Error al eliminar el registro de vacunación" };
  }
};
