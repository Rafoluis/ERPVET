import { z } from 'zod'
import { UserSchema } from './user.schema'

export const EmployeeSchema = UserSchema.extend({
  especialidad: z.string().min(1, 'La especialidad es obligatoria'),
  estado: z.enum(['Activo', 'Eliminado']).optional(),
})

export type Employee = z.infer<typeof EmployeeSchema>