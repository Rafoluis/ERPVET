'use server'

import prisma from '@/lib/prisma'
import { sleep } from '@/lib/sleep'
import { tryCatch } from '@/lib/try-catch'
import { Employee } from '@/schemas/employee.schema'
import { ApiResponse } from '@/types/api-response.type'
import { TipoRol } from '@prisma/client'
import { revalidatePath } from 'next/cache'

export const getAllEmployees = async (): Promise<Employee[]> => {
  const employees = await prisma.empleado.findMany({
    select: {
      id_empleado: true,
      especialidad: true,
      fecha_creacion: true,
      usuario: {
        select: {
          nombre: true,
          apellido: true,
          dni: true,
          email: true,
          telefono: true,
          direccion: true,
          password: true,
          sexo: true,
          roles: {
            select: {
              rol: {
                select: {
                  nombre: true,
                },
              },
            },
          },
        },
      },
    },
  })

  if (!employees) throw new Error('No employees found')

  await sleep(1000)

  const data = employees.map((employee) => ({
    id: employee.id_empleado,
    nombre: employee.usuario.nombre,
    apellido: employee.usuario.apellido,
    dni: employee.usuario.dni,
    especialidad: employee.especialidad,
    fecha_creacion: employee.fecha_creacion,
    roles: employee.usuario.roles.map((role) => role.rol.nombre),
    sexo: employee.usuario.sexo,
    email: employee.usuario.email,
    telefono: employee.usuario.telefono,
    direccion: employee.usuario.direccion,
    password: employee.usuario.password,
  }))

  return data
}

export const createOrUpdateEmployee  = async (
  employee: Employee
): Promise<ApiResponse<Employee>> => {
  return tryCatch(async () => {
    const newUser = await prisma.usuario.create({
      data: {
        nombre: employee.nombre,
        apellido: employee.apellido,
        dni: employee.dni,
        sexo: employee.sexo,
        email: employee.email,
        telefono: employee.telefono ?? undefined,
        direccion: employee.direccion ?? null,
        password: employee.password,
        roles: {
          create: employee.roles.map((rolNombre) => ({
            rol: {
              connectOrCreate: {
                where: { nombre: rolNombre as TipoRol },
                create: { nombre: rolNombre as TipoRol },
              },
            },
          })),
        },
      },
      include: {
        roles: {
          include: {
            rol: true,
          },
        },
      },
    });

    const newEmployee = await prisma.empleado.create({
      data: {
        especialidad: employee.especialidad,
        fecha_creacion: new Date(),
        usuario: {
          connect: { id_usuario: newUser.id_usuario },
        },
      },
    });

    const completedData: Employee = {
      ...newEmployee,
      ...newUser,
      roles: newUser.roles.map((role) => role.rol.nombre),
    };

    revalidatePath('/admin');

    return { data: completedData, message: 'Empleado creado exitosamente' };
  });
};

export const deleteEmployee = async (dni: string): Promise<ApiResponse<null>> => {
  return tryCatch(async () => {
    const usuario = await prisma.usuario.findUnique({
      where: { dni },
    });

    if (!usuario) {
      return { data: null, message: 'Usuario no encontrado', error: 'NOT_FOUND' };
    }

    const empleado = await prisma.empleado.findUnique({
      where: { id_usuario: usuario.id_usuario },
    });

    if (!empleado) {
      return { data: null, message: 'Empleado no encontrado', error: 'NOT_FOUND' };
    }

    await prisma.empleado.delete({
      where: { id_empleado: empleado.id_empleado },
    });

    await prisma.usuario.delete({
      where: { dni },
    });

    revalidatePath('/admin');

    return { data: null, message: 'Empleado eliminado exitosamente', error: '' };
  });
};
