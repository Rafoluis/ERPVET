'use server'

import prisma from '@/lib/prisma'
import { sleep } from '@/lib/sleep'
import { tryCatch } from '@/lib/try-catch'
import { Employee } from '@/schemas/employee.schema'
import { ApiResponse } from '@/types/api-response.type'
import { Prisma, TipoRol } from '@prisma/client'
import { revalidatePath } from 'next/cache'

export const getAllEmployees = async (
  search: string = '',
  start?: string,
  end?: string,
  sort?: 'asc' | 'desc',
  column?: string
): Promise<Employee[]> => {
  const whereClause: Prisma.EmpleadoWhereInput = {}

  if (search) {
    whereClause.OR = [
      { usuario: { nombre: { contains: search, mode: 'insensitive' } } },
      { usuario: { apellido: { contains: search, mode: 'insensitive' } } },
      { usuario: { dni: { contains: search, mode: 'insensitive' } } },
    ]
  }

  if (start || end) {
    let startDate: Date | undefined
    let endDate: Date | undefined

    if (start) {
      startDate = new Date(start)
    }
    if (end) {
      endDate = new Date(end)
      endDate.setHours(23, 59, 59, 999)
    }

    whereClause.fecha_creacion = {
      ...(startDate ? { gte: startDate } : {}),
      ...(endDate ? { lte: endDate } : {}),
    }
  }

  let orderBy: Prisma.EmpleadoOrderByWithRelationInput | undefined = undefined;
  if (sort && column) {
    const userColumns = ['nombre', 'apellido', 'dni', 'email', 'telefono', 'direccion', 'password', 'sexo'];
    if (userColumns.includes(column)) {
      orderBy = { usuario: { [column]: sort } };
    } else {
      orderBy = { [column]: sort };
    }
  }

  // await sleep(3000)

  const employees = await prisma.empleado.findMany({
    where: whereClause,
    orderBy, 
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

export const createOrUpdateEmployee = async (
  employee: Employee
): Promise<ApiResponse<Employee>> => {
  return tryCatch(async () => {
    const existEmployee = await prisma.usuario.findUnique({
      where: { dni: employee.dni },
    })

    const newUser = await prisma.usuario.upsert({
      where: { dni: employee.dni },
      update: {
        nombre: employee.nombre,
        apellido: employee.apellido,
        sexo: employee.sexo,
        email: employee.email,
        telefono: employee.telefono ?? undefined,
        direccion: employee.direccion ?? null,
        password: employee.password,
        roles: {
          deleteMany: {},
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
      create: {
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
    })

    const newEmployee = await prisma.empleado.upsert({
      where: { id_usuario: newUser.id_usuario },
      update: {
        especialidad: employee.especialidad,
      },
      create: {
        especialidad: employee.especialidad,
        fecha_creacion: new Date(),
        usuario: {
          connect: { id_usuario: newUser.id_usuario },
        },
      },
    })

    const completedData: Employee = {
      ...newEmployee,
      ...newUser,
      roles: newUser.roles.map((role) => role.rol.nombre),
    }

    revalidatePath('/admin')
    const message = existEmployee
      ? 'Empleado actualizado exitosamente'
      : 'Empleado creado exitosamente'

    return { data: completedData, message, error: '' }
  })
}

export const deleteEmployee = async (
  dni: string
): Promise<ApiResponse<null>> => {
  return tryCatch(async () => {
    const usuario = await prisma.usuario.findUnique({
      where: { dni },
    })

    if (!usuario) {
      return {
        data: null,
        message: 'Usuario no encontrado',
        error: 'NOT_FOUND',
      }
    }

    const empleado = await prisma.empleado.findUnique({
      where: { id_usuario: usuario.id_usuario },
    })

    if (!empleado) {
      return {
        data: null,
        message: 'Empleado no encontrado',
        error: 'NOT_FOUND',
      }
    }

    await prisma.usuarioRol.deleteMany({
      where: { id_usuario: usuario.id_usuario },
    })

    await prisma.empleado.delete({
      where: { id_empleado: empleado.id_empleado },
    })

    await prisma.usuario.delete({
      where: { dni },
    })

    revalidatePath('/admin')

    return { data: null, message: 'Empleado eliminado exitosamente', error: '' }
  })
}
