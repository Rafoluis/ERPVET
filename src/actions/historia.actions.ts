"use server"

import { HistoriaSchema } from "@/lib/formSchema";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

type CurrentState = { success: boolean; error: string | null };

const formatFechaCreacion = (fecha: Date) => {
  return new Date(
    new Date(fecha).toLocaleString("sv-SE", { timeZone: "America/Lima" })
  );
};

export const createHistoriaClinica = async (
  currentState: CurrentState,
  data: HistoriaSchema
): Promise<CurrentState & { idHistoriaClinica?: number }> => {
  try {
    const fechaPeru = data.fechaCreacion
      ? formatFechaCreacion(data.fechaCreacion)
      : undefined;
    
    const nueva = await prisma.historiaClinica.create({
      data: {
        idMascota: data.idMascota,
        tamaño: data.tamaño,
        color: data.color,
        señalesParticulares: data.señalesParticulares,
        finZootecnico: data.finZootecnico,
        origenProcedencia: data.origenProcedencia,
        enfermedadPrevia: data.enfermedadPrevia,
        alimentacion: data.alimentacion,
        habitad: data.habitad,
        viajesRecientes: data.viajesRecientes,
        convivencia: data.convivencia,
        comportamiento: data.comportamiento,
        partos: data.partos,
        viveConAnimales: data.viveConAnimales
      },
    });
    revalidatePath('/mascotas/[id]'); 
    return { success: true, error: null , idHistoriaClinica: nueva.idHistoriaClinica,};
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.stack);
    } else {
      console.error("Error desconocido al crear historia clínica:", err);
    }
    return { success: false, error: "Error al crear historia clínica" };
  }
};

export const updateHistoriaClinica = async (
  currentState: CurrentState,
  data: HistoriaSchema
): Promise<CurrentState> => {
  try {
    const updateData: any = {
        tamaño: data.tamaño,
        color: data.color,
        señalesParticulares: data.señalesParticulares,
        finZootecnico: data.finZootecnico,
        origenProcedencia: data.origenProcedencia,
        enfermedadPrevia: data.enfermedadPrevia,
        alimentacion: data.alimentacion,
        habitad: data.habitad,
        viajesRecientes: data.viajesRecientes,
        convivencia: data.convivencia,
        comportamiento: data.comportamiento,
        partos: data.partos,
        viveConAnimales: data.viveConAnimales
    };

    if (data.fechaCreacion) {
      updateData.fechaCreacion = formatFechaCreacion(data.fechaCreacion);
    }

    await prisma.historiaClinica.update({
      where: { idHistoriaClinica: data.idHistoriaClinica! },
      data: updateData,
    });

    return { success: true, error: null };
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.stack);
    } else {
      console.error("Error desconocido al actualizar historia clínica:", err);
    }
    return { success: false, error: "Error al actualizar historia clínica" };
  }
};