'use server'

import prisma from '@/lib/prisma'
import { sleep } from '@/lib/sleep'
import { Employee } from '@/schemas/employee.schema'
import { Prisma, TipoRol } from '@prisma/client'
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

type CreateEmployeeResponse = {
  success: boolean
  data?: Employee
  error?: string
  message?: string
}

export const createEmployee = async (
  employee: Employee
): Promise<CreateEmployeeResponse> => {
  try {
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
    })

    const newEmployee = await prisma.empleado.create({
      data: {
        especialidad: employee.especialidad,
        fecha_creacion: new Date(),
        usuario: {
          connect: { id_usuario: newUser.id_usuario },
        },
      },
    })

    const completedData = {
      ...newEmployee,
      ...newUser,
      roles: newUser.roles.map((role) => role.rol.nombre),
    }

    revalidatePath('/admin')

    return {
      success: true,
      data: completedData,
      message: `Empleado ${employee.nombre} ${employee.apellido} creado exitosamente`,
    }
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        const field = (error.meta?.target as string[])?.[0] || 'campo'
        if (field === 'email') {
          return {
            success: false,
            error: 'El email ya está registrado',
          }
        }
        if (field === 'dni') {
          return {
            success: false,
            error: 'El DNI ya está registrado',
          }
        }
        return {
          success: false,
          error: `El ${field} ya está en uso`,
        }
      }

      if (error.code === 'P2003') {
        return {
          success: false,
          error: 'Error en la relación de datos',
        }
      }

      if (error.code === 'P2000') {
        return {
          success: false,
          error: 'Los datos proporcionados no son válidos',
        }
      }
    }

    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
      }
    }

    console.error('Error inesperado:', error)
    return {
      success: false,
      error: 'Ocurrió un error inesperado',
    }
  }
}
