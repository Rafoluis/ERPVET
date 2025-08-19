"use server"

import { MascotaSchema } from "@/lib/formSchema";
import prisma from "@/lib/prisma";

type CurrentState = { success: boolean; error: string | null };

const formatFechaNacimiento = (fecha: Date) => {
    return new Date(
        new Date(fecha).toLocaleString("sv-SE", { timeZone: "America/Lima" })
    );
};

export const createMascota = async (
  currentState: CurrentState,
  data: MascotaSchema
) => {
  try {
    const fechaNacimientoPeru = data.fechaNacimiento
            ? formatFechaNacimiento(data.fechaNacimiento)
            : null;
    await prisma.mascota.create({
      data: {
        nombre: data.nombre,
        especie: data.especie,
        raza: data.raza,
        sexo: data.sexo,
        fechaNacimiento: fechaNacimientoPeru!,
        peso: data.peso ?? undefined,
        numeroChip: data.numeroChip ?? undefined,
        esterilizado: data.esterilizado ?? false,
        alergias: data.alergias ?? undefined,
        notasComportamiento: data.notasComportamiento ?? undefined,
        // propietario - data.idPropietario
        idPropietario: data.idPropietario,
        urlfoto: data.img ?? undefined,
      },
    });
    return { success: true, error: null };
    } catch (err) {
        if (err instanceof Error) {
            console.error(err.stack);
        } else {
            console.error("Se produjo un error desconocido:", err);
        }
        return { success: false, error: "Error al crear un paciente" };
    }
};

export const updateMascota = async (
  currentState: CurrentState,
  data: MascotaSchema
) => {
  try {
    await prisma.mascota.update({
      where: { idMascota: data.idMascota! },
      data: {
        nombre: data.nombre,
        especie: data.especie,
        raza: data.raza,
        sexo: data.sexo,
        fechaNacimiento: data.fechaNacimiento
        ? formatFechaNacimiento(data.fechaNacimiento)
        : undefined,
        peso: data.peso ?? undefined,
        numeroChip: data.numeroChip ?? undefined,
        esterilizado: data.esterilizado ?? false,
        alergias: data.alergias ?? undefined,
        notasComportamiento: data.notasComportamiento ?? undefined,
        urlfoto: data.img ?? undefined,
      },
    });
    return { success: true, error: null };
    } catch (err) {
        if (err instanceof Error) {
            console.error(err.stack);
        } else {
            console.error("Se produjo un error desconocido:", err);
        }
        return { success: false, error: "Error al actualizar un paciente" };
    }
};

export const deleteMascota = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  const mascotaId = parseInt(id, 10);
  if (isNaN(mascotaId)) {
    throw new Error("ID de mascota inválido");
  }
  try {
    await prisma.mascota.update({
      where: { idMascota: mascotaId },
      data: { deletedAt: new Date() },
    });
    return { success: true, error: null };
  } catch (err) {
    console.error("Error eliminando mascota:", err);
    return { success: false, error: "Error al eliminar la mascota" };
  }
};
