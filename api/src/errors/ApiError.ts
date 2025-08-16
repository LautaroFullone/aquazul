// lib/ApiError.ts
export class ApiError extends Error {
   status: number
   errorCode: string
   details?: unknown

   constructor(message: string, status: number, code: string, details?: unknown) {
      super(message)
      this.status = status
      this.errorCode = code
      this.details = details
   }
}

export class BadRequestError extends ApiError {
   constructor(message = 'Bad Request', details?: unknown) {
      super(message, 400, 'BAD_REQUEST', details)
   }
}

export class NotFoundError extends ApiError {
   constructor(message = 'Not Found', details?: unknown) {
      super(message, 404, 'NOT_FOUND', details)
   }
}

export class ConflictError extends ApiError {
   constructor(message = 'Conflict', details?: unknown) {
      super(message, 409, 'CONFLICT', details)
   }
}
