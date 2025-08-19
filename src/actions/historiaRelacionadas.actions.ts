"use server"

import prisma from "@/lib/prisma"

type CurrentState = { success: boolean; error: string | null };

const formatFecha = (fecha: Date) => {
  return new Date(
    new Date(fecha).toLocaleString("sv-SE", { timeZone: "America/Lima" })
  );
};

// ENFERMEDAD PREVIA

export const createEnfermedadPrevia = async (
  currentState: CurrentState,
  data: { idHistoriaClinica: number; descripcion: string; fecha?: Date }
): Promise<CurrentState> => {
  try {
    await prisma.enfermedadPrevia.create({
      data: {
        idHistoriaClinica: data.idHistoriaClinica,
        descripcion: data.descripcion,
        fecha: data.fecha ? formatFecha(data.fecha) : undefined,
      },
    });
    return { success: true, error: null };
  } catch (err) {
    console.error("Error creando enfermedad previa:", err);
    return { success: false, error: "Error al registrar enfermedad previa" };
  }
};

export const updateEnfermedadPrevia = async (
  currentState: CurrentState,
  data: { id: number; descripcion: string; fecha?: Date }
): Promise<CurrentState> => {
  try {
    await prisma.enfermedadPrevia.update({
      where: { id: data.id },
      data: {
        descripcion: data.descripcion,
        fecha: data.fecha ? formatFecha(data.fecha) : undefined,
      },
    });
    return { success: true, error: null };
  } catch (err) {
    console.error("Error actualizando enfermedad previa:", err);
    return { success: false, error: "Error al actualizar enfermedad previa" };
  }
};

export const deleteEnfermedadPrevia = async (
  currentState: CurrentState,
  form: FormData
): Promise<CurrentState> => {
  const id = parseInt(form.get("id") as string, 10);
  if (isNaN(id)) return { success: false, error: "ID inválido" };

  try {
    await prisma.enfermedadPrevia.delete({ where: { id } });
    return { success: true, error: null };
  } catch (err) {
    console.error("Error eliminando enfermedad previa:", err);
    return { success: false, error: "Error al eliminar enfermedad previa" };
  }
};

// CIRUGÍA PREVIA

export const createCirugiaPrevia = async (
  currentState: CurrentState,
  data: { idHistoriaClinica: number; descripcion: string; fecha?: Date }
): Promise<CurrentState> => {
  try {
    await prisma.cirugiaPrevia.create({
      data: {
        idHistoriaClinica: data.idHistoriaClinica,
        descripcion: data.descripcion,
        fecha: data.fecha ? formatFecha(data.fecha) : undefined,
      },
    });
    return { success: true, error: null };
  } catch (err) {
    console.error("Error creando cirugía previa:", err);
    return { success: false, error: "Error al registrar cirugía previa" };
  }
};

export const updateCirugiaPrevia = async (
  currentState: CurrentState,
  data: { id: number; descripcion: string; fecha?: Date }
): Promise<CurrentState> => {
  try {
    await prisma.cirugiaPrevia.update({
      where: { id: data.id },
      data: {
        descripcion: data.descripcion,
        fecha: data.fecha ? formatFecha(data.fecha) : undefined,
      },
    });
    return { success: true, error: null };
  } catch (err) {
    console.error("Error actualizando cirugía previa:", err);
    return { success: false, error: "Error al actualizar cirugía previa" };
  }
};

export const deleteCirugiaPrevia = async (
  currentState: CurrentState,
  form: FormData
): Promise<CurrentState> => {
  const id = parseInt(form.get("id") as string, 10);
  if (isNaN(id)) return { success: false, error: "ID inválido" };

  try {
    await prisma.cirugiaPrevia.delete({ where: { id } });
    return { success: true, error: null };
  } catch (err) {
    console.error("Error eliminando cirugía previa:", err);
    return { success: false, error: "Error al eliminar cirugía previa" };
  }
};

// TRATAMIENTO RECIENTE

export const createTratamientoReciente = async (
  currentState: CurrentState,
  data: {
    idHistoriaClinica: number;
    descripcion: string;
    fechaInicio?: Date;
    fechaFin?: Date;
  }
): Promise<CurrentState> => {
  try {
    await prisma.tratamientoReciente.create({
      data: {
        idHistoriaClinica: data.idHistoriaClinica,
        descripcion: data.descripcion,
        fechaInicio: data.fechaInicio ? formatFecha(data.fechaInicio) : undefined,
        fechaFin: data.fechaFin ? formatFecha(data.fechaFin) : undefined,
      },
    });
    return { success: true, error: null };
  } catch (err) {
    console.error("Error creando tratamiento reciente:", err);
    return { success: false, error: "Error al registrar tratamiento reciente" };
  }
};

export const updateTratamientoReciente = async (
  currentState: CurrentState,
  data: {
    id: number;
    descripcion: string;
    fechaInicio?: Date;
    fechaFin?: Date;
  }
): Promise<CurrentState> => {
  try {
    await prisma.tratamientoReciente.update({
      where: { id: data.id },
      data: {
        descripcion: data.descripcion,
        fechaInicio: data.fechaInicio ? formatFecha(data.fechaInicio) : undefined,
        fechaFin: data.fechaFin ? formatFecha(data.fechaFin) : undefined,
      },
    });
    return { success: true, error: null };
  } catch (err) {
    console.error("Error actualizando tratamiento reciente:", err);
    return { success: false, error: "Error al actualizar tratamiento reciente" };
  }
};

export const deleteTratamientoReciente = async (
  currentState: CurrentState,
  form: FormData
): Promise<CurrentState> => {
  const id = parseInt(form.get("id") as string, 10);
  if (isNaN(id)) return { success: false, error: "ID inválido" };

  try {
    await prisma.tratamientoReciente.delete({ where: { id } });
    return { success: true, error: null };
  } catch (err) {
    console.error("Error eliminando tratamiento reciente:", err);
    return { success: false, error: "Error al eliminar tratamiento reciente" };
  }
};
