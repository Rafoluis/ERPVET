type PrismaError = {
  code: string;
  field?: string;
  message: string;
}

export const PRISMA_ERRORS: Record<string, (field?: string) => PrismaError> = {
  P2002: (field) => ({
    code: 'P2002',
    field,
    message: field === 'email' 
      ? 'El email ya está registrado'
      : field === 'dni'
      ? 'El DNI ya está registrado'
      : `El ${field} ya está en uso`
  }),
  P2003: () => ({
    code: 'P2003',
    message: 'Error en la relación de datos'
  }),
  P2000: () => ({
    code: 'P2000',
    message: 'Los datos proporcionados no son válidos'
  })
}