import { AxiosError } from 'axios'

export interface ApiErrorResponse {
   message: string
   code: string
   details?: unknown
}

export function extractErrorData(error: unknown): ApiErrorResponse {
   if (error instanceof AxiosError && error.response?.data) {
      const { message, code, details } = error.response.data as ApiErrorResponse
      return { message, code, details }
   }

   return {
      message: error instanceof Error ? error.message : 'Error desconocido',
      code: 'UNKNOWN_ERROR',
   }
}
