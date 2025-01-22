import { ApiResponse } from "@/types/api-response.type"
import { handleSuccess } from "./errors/success-handler"
import { handleError } from "./errors/error-handler"

type ResponseWithMessage<T> = { data: T; message: string }

export async function tryCatch<T>(
  fn: () => Promise<ResponseWithMessage<T>>
): Promise<ApiResponse<T>> {
  try {
    const result = await fn()
    return handleSuccess(result.data, result.message || "Operación exitosa")
  } catch (error) {
    return handleError(error)
  }
}