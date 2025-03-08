import { z } from 'zod'

export const UserSchema = z.object({
  nombre: z.string().min(1, 'El nombre es obligatorio'),
  apellido: z.string().min(1, 'El apellido es obligatorio'),
  dni: z.string().regex(/^\d{8}$/, 'El DNI debe tener 8 dígitos'),
  sexo: z.enum(['MASCULINO', 'FEMENINO'], {
    errorMap: () => ({ message: 'El sexo es obligatorio' }),
  }),
  email: z.string().email('Email no válido').nullable().optional(),
  telefono: z
    .string()
    .optional()
    .nullable()
    .refine(
      (value) => (value ? /^\d{9}$/.test(value) : true),
      'El teléfono debe tener 9 dígitos'
    ),
  direccion: z
    .string()
    .nullable()
    .optional()
    .transform((val) => (val === '' ? null : val))
    .refine((val) => !val || val.length >= 1, 'La dirección es obligatoria'),
  password: z.string().min(5, 'La contraseña debe tener al menos 5 caracteres'),
  roles: z.array(z.string()).min(1, 'Debes seleccionar al menos un rol'),
  fecha_creacion: z.date().nullable().optional(),
})

export type User = z.infer<typeof UserSchema>
