"use server";

import { z } from "zod";
import prisma from "@/lib/prisma";
import { EmpleadoSchema } from "@/lib/formSchema";

type CurrentState = { success: boolean; error: string | null };
type CreateResult = CurrentState & { created?: any };

export const createEmpleado = async (
  currentState: CurrentState,
  data: EmpleadoSchema
): Promise<CreateResult> => {
  try {
    console.time("createEmpleado");
    // app/actions/empleado.actions.ts (reemplaza la creación)
    const rolNombre = "VETERINARIO";

    const usuario = await prisma.usuario.create({
    data: {
        nombre: data.nombre,
        apellido: data.apellido,
        dni: String(data.dni),
        sexo: data.sexo,
        email: data.email ?? undefined,
        telefono: data.telefono ?? "",
        direccion: data.direccion ?? undefined,
        password: data.password,
        // CREAR LA RELACION ROL de forma anidada (igual que la seed)
        roles: {
        create: {
            rol: {
            connectOrCreate: {
                where: { nombre: rolNombre as any },
                create: { nombre: rolNombre as any },
            },
            },
        },
        },
    },
    include: {
        roles: { include: { rol: true } }, // opcional: devolver las relaciones
    },
    });

    // luego crea empleado
    const empleado = await prisma.empleado.create({
    data: {
        idUsuario: usuario.idUsuario,
        especialidad: data.especialidad,
    },
    });

    console.timeEnd("createEmpleado");
    return { success: true, error: null, created: { usuario, empleado } };
  } catch (err) {
    console.error("Error al crear empleado:", err);
    return { success: false, error: "Error al crear empleado" };
  }
};

export const updateEmpleado = async (
  currentState: CurrentState,
  data: EmpleadoSchema
): Promise<CreateResult> => {
  try {
    // Si proporcionas idUsuario en el payload usamos eso; si no, buscamos via idEmpleado
    let idUsuario = data.idUsuario;
    if (!idUsuario && data.idEmpleado) {
      const existing = await prisma.empleado.findUnique({
        where: { idEmpleado: data.idEmpleado },
        select: { idUsuario: true },
      });
      idUsuario = existing?.idUsuario;
    }

    if (!idUsuario) {
      throw new Error("idUsuario no disponible para actualizar");
    }

    await prisma.usuario.update({
      where: { idUsuario },
      data: {
        nombre: data.nombre,
        apellido: data.apellido,
        dni: String(data.dni),
        sexo: data.sexo as any,
        email: data.email ?? undefined,
        telefono: data.telefono ?? "",
        direccion: data.direccion ?? undefined,
        ...(data.password ? { password: data.password } : {}),
      },
    });

    const empleado = await prisma.empleado.update({
      where: { idEmpleado: data.idEmpleado! },
      data: {
        especialidad: data.especialidad,
      },
    });

    return { success: true, error: null, created: { empleado } };
  } catch (err) {
    console.error("Error al actualizar empleado:", err);
    return { success: false, error: "Error al actualizar empleado" };
  }
};

export const deleteEmpleado = async (
  currentState: CurrentState,
  formData: FormData
): Promise<CurrentState> => {
  const id = formData.get("id") as string;
  const idEmp = parseInt(id, 10);
  if (isNaN(idEmp)) {
    throw new Error("ID de empleado inválido");
  }

  try {
    await prisma.empleado.update({
      where: { idEmpleado: idEmp },
      data: { deletedAt: new Date() },
    });
    return { success: true, error: null };
  } catch (err) {
    console.error("Error al eliminar empleado:", err);
    return { success: false, error: "Error al eliminar empleado" };
  }
};