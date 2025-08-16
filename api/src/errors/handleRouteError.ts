import { ApiError } from './ApiError'
import { Prisma } from '@prisma/client'
import { Response } from 'express'
import z, { ZodError } from 'zod'
import { NOT_FOUND_MESSAGES } from './errorLabels'

export function handleRouteError(res: Response, caughtError: unknown) {
   console.log('\n----<|| ERROR ||>-----------------------\n')
   console.error(caughtError)
   console.log('----------------------------------------')

   // 1) Errores propios
   if (caughtError instanceof ApiError) {
      return res.status(caughtError.status).send({
         message: caughtError.message,
         code: caughtError.errorCode,
         ...(caughtError.details ? { details: caughtError.details } : {}),
      })
   }

   // 2) Validación Zod
   if (caughtError instanceof ZodError) {
      return res.status(400).send({
         message: 'Datos inválidos',
         code: 'ZOD_ERROR',
         ...z.treeifyError(caughtError),
      })
   }

   // 3) Prisma comunes
   if (caughtError instanceof Prisma.PrismaClientKnownRequestError) {
      if (caughtError.code === 'P2002') {
         return res.status(409).send({
            message: 'Ya existe un recurso con el mismo dato único',
            code: 'UNIQUE_CONSTRAINT',
            details: caughtError.meta,
         })
      }
      if (caughtError.code === 'P2025') {
         const model = (caughtError.meta?.modelName as string) || ''
         const notFoundMessage = NOT_FOUND_MESSAGES[model] || 'Recurso no encontrado'

         return res.status(404).send({
            message: notFoundMessage,
            code: 'RECORD_NOT_FOUND',
            details: caughtError.meta,
         })
      }
   }

   // 4) Fallback
   return res.status(500).send({ message: 'Ocurrió un error inesperado del servidor' })
}
