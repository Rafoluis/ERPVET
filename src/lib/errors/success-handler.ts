import { ApiResponse } from "@/types/api-response.type";

export function handleSuccess<T>(data: T, message?: string): ApiResponse<T> {
  return {
    success: true,
    data,
    message: message ?? "",
    error: "",
  }
}