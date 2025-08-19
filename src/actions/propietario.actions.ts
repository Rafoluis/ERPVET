// app/actions/propietario.actions.ts
"use server";

import { PropietarioSchema } from "@/lib/formSchema";
import prisma from "@/lib/prisma";

type CurrentState = { success: boolean; error: string | null };

export const createPropietario = async (
  currentState: CurrentState,
  data: PropietarioSchema
): Promise<CurrentState> => {
  try {
    await prisma.propietario.create({
      data: {
        dni:           data.dni,
        nombre:        data.nombre,
        apellido:      data.apellido,
        correo:        data.correo,
        telefono:      data.telefono,
        direccion:     data.direccion ?? undefined,
      },
    });
    return { success: true, error: null };
  } catch (err) {
    console.error("Error al crear propietario:", err);
    return { success: false, error: "Error al crear propietario" };
  }
};

export const updatePropietario = async (
  currentState: CurrentState,
  data: PropietarioSchema
): Promise<CurrentState> => {
  try {
    await prisma.propietario.update({
      where: { idPropietario: data.idPropietario! },
      data: {
        dni:       data.dni,
        nombre:    data.nombre,
        apellido:  data.apellido,
        correo:    data.correo,
        telefono:  data.telefono,
        direccion: data.direccion ?? undefined,
      },
    });
    return { success: true, error: null };
  } catch (err) {
    console.error("Error al actualizar propietario:", err);
    return { success: false, error: "Error al actualizar propietario" };
  }
};

export const deletePropietario = async (
  currentState: CurrentState,
  formData: FormData
): Promise<CurrentState> => {
  const id = formData.get("id") as string;
  const idProp = parseInt(id, 10);
  if (isNaN(idProp)) {
    throw new Error("ID de propietario inválido");
  }
  try {
    await prisma.propietario.update({
      where: { idPropietario: idProp },
      data: { deletedAt: new Date() },
    });
    return { success: true, error: null };
  } catch (err) {
    console.error("Error al eliminar propietario:", err);
    return { success: false, error: "Error al eliminar propietario" };
  }
};
