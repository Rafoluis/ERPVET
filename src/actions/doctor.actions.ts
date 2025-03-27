"use server"

import prisma from "../lib/prisma";
import { DoctorSchema } from "../lib/formSchema";
type CurrentState = { success: boolean; error: string | null };

async function isDniDuplicate(dni: string, excludeUserId?: number): Promise<boolean> {
  const existingUser = await prisma.usuario.findFirst({
    where: {
      dni,
      ...(excludeUserId ? { id_usuario: { not: excludeUserId } } : {}),
    },
  });
  return !!existingUser;
}

export const createDoctor = async (
  currentState: CurrentState,
  data: DoctorSchema
) => {
  try {
    if (await isDniDuplicate(data.dni)) {
      return { success: false, error: "El DNI ya está registrado" };
    }
    await prisma.empleado.create({
      data: {
        especialidad: data.especialidad,
        usuario: {
          create: {
            nombre: data.nombre,
            apellido: data.apellido,
            dni: data.dni,
            sexo: data.sexo,
            email: data.email,
            telefono: data.telefono,
            direccion: data.direccion,
            password: data.password || "123456789",
            roles: {
              create: {
                rol: { connect: { nombre: "ODONTOLOGO" } },
              },
            },
          },
        },
      },
    });
    return { success: true, error: null };
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.stack);
    } else {
      console.error("Se produjo un error desconocido:", err);
    }
    return { success: false, error: "Error al crear un doctor" };
  }
};

export const updateDoctor = async (
  currentState: CurrentState,
  data: DoctorSchema
) => {
  try {
    const empleado = await prisma.empleado.findUnique({
      where: { id_empleado: data.id_empleado },
      select: { id_usuario: true },
    });
    if (!empleado) {
      return { success: false, error: "Doctor no encontrado" };
    }
    if (await isDniDuplicate(data.dni, empleado.id_usuario)) {
      return { success: false, error: "El DNI ya está registrado" };
    }
    await prisma.empleado.update({
      where: {
        id_empleado: data.id_empleado!,
      },
      data: {
        especialidad: data.especialidad,
        usuario: {
          update: {
            nombre: data.nombre,
            apellido: data.apellido,
            dni: data.dni,
            sexo: data.sexo,
            email: data.email,
            telefono: data.telefono,
            direccion: data.direccion,
            password: data.password || "123456789",
          },
        },
      },
    });
    return { success: true, error: null };
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.stack);
    } else {
      console.error("Se produjo un error desconocido:", err);
    }
    return { success: false, error: "Error al actualizar un doctor" };
  }
};

export const deleteDoctor = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  const doctorId = parseInt(id, 10);
  if (isNaN(doctorId)) {
    throw new Error("ID de doctor inválido");
  }
  try {
    await prisma.$transaction(async (tx) => {
      const doctorEliminado = await tx.empleado.update({
        where: { id_empleado: doctorId },
        data: { deletedAt: new Date() },
      });
      await tx.usuario.update({
        where: { id_usuario: doctorEliminado.id_usuario },
        data: { deletedAt: new Date() },
      });
    });
    return { success: true, error: null };
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.stack);
    } else {
      console.error("Se produjo un error desconocido:", err);
    }
    return { success: false, error: "Error al eliminar un doctor" };
  }
};
