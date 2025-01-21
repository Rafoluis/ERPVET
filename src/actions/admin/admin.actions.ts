'use server';

import prisma from '../../lib/prisma';
import { Employee } from '@/types/user.interface';

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
    }
  });

  if (!employees) throw new Error('No employees found');

  const data = employees.map((employee) => ({
    id: employee.id_empleado,
    nombre: employee.usuario.nombre,
    apellido: employee.usuario.apellido,
    dni: employee.usuario.dni,
    especialidad: employee.especialidad,
    fecha_creacion: employee.fecha_creacion,
    roles: employee.usuario.roles.map((role) => role.rol.nombre).join(', '),
  }));

  return data;
};
