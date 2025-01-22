import { Prisma } from "@prisma/client";
import { PRISMA_ERRORS } from "./prisma-errors";
import { ApiResponse } from "@/types/api-response.type";

export class AppError extends Error {
  constructor(
    public message: string,
    public code?: string,
    public statusCode: number = 400
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function handleError<T>(error: unknown): ApiResponse<T> {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const field = (error.meta?.target as string[])?.[0]
    const prismaError = PRISMA_ERRORS[error.code]?.(field)
    
    if (prismaError) {
      return {
        success: false,
        error: prismaError.message
      }
    }
  }

  if (error instanceof AppError) {
    return {
      success: false,
      error: error.message
    }
  }

  if (error instanceof Error) {
    return {
      success: false,
      error: error.message
    }
  }

  console.error('Error inesperado:', error)
  return {
    success: false,
    error: 'Ocurrió un error inesperado'
  }
}