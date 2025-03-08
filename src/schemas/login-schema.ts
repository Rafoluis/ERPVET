import { z } from 'zod';

export const loginSchema = z.object({
  dni: z.string().length(8, 'El DNI debe tener 8 caracteres'),
  password: z.string().min(4, 'La contraseña debe tener al menos 4 caracteres'),
})

export type LoginSchema = z.infer<typeof loginSchema>;