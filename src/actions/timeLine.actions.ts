// src/actions/lineatiempo.actions.ts
"use server";

import { TimeLineSchema } from "@/lib/formSchema";
import prisma from "@/lib/prisma";

type CurrentState = { success: boolean; error: string | null };

// const formatDate = (d: Date) =>
//   new Date(
//     new Date(d).toLocaleString("sv-SE", { timeZone: "America/Lima" })
//   );

export const createLineaTiempo = async (
  currentState: CurrentState,
  data: TimeLineSchema
) => {
  try {
    await prisma.lineaTiempo.create({
      data: {
        idHistoriaClinica: data.idHistoriaClinica,
        tipo: data.tipo,
        titulo: data.titulo,
        ubicacion: data.ubicacion,
        descripcion: data.descripcion,
        detalles: data.detalles ?? [],
      },
    });
    return { success: true, error: null };
  } catch (err) {
    console.error("Error creando línea de tiempo:", err);
    return { success: false, error: "Error al crear evento en línea de tiempo" };
  }
};

export const updateLineaTiempo = async (
  currentState: CurrentState,
  data: TimeLineSchema
) => {
  try {
    await prisma.lineaTiempo.update({
      where: { id: data.id! },
      data: {
        tipo: data.tipo,
        titulo: data.titulo,
        ubicacion: data.ubicacion,
        descripcion: data.descripcion,
        detalles: data.detalles ?? [],
      },
    });
    return { success: true, error: null };
  } catch (err) {
    console.error("Error actualizando línea de tiempo:", err);
    return { success: false, error: "Error al actualizar evento en línea de tiempo" };
  }
};

export const deleteLineaTiempo = async (
  currentState: CurrentState,
  data: { id: number }
): Promise<CurrentState> => {
  try {
    await prisma.lineaTiempo.update({
      where: { id: data.id },
      data: { deletedAt: new Date() },
    });
    return { success: true, error: null };
  } catch (err) {
    console.error("Error eliminando línea de tiempo:", err);
    return { success: false, error: "Error al eliminar evento en línea de tiempo" };
  }
};
