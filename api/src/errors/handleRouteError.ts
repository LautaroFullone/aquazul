import {
   FOREIGN_KEY_CONSTRAINT_MESSAGES,
   NOT_FOUND_MESSAGES,
   UNIQUE_CONSTRAINT_MESSAGES,
} from './errorLabels'
import { Prisma } from '@prisma/client'
import { ApiError } from './ApiError'
import { Response } from 'express'
import z, { ZodError } from 'zod'

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
         const model = (caughtError.meta?.modelName as string) || ''
         const uniqueMessage =
            UNIQUE_CONSTRAINT_MESSAGES[model] ||
            'Ya existe un recurso con el mismo dato único'

         return res.status(409).send({
            message: uniqueMessage,
            code: 'UNIQUE_CONSTRAINT',
            details: caughtError.meta,
         })
      }
      if (caughtError.code === 'P2003') {
         const constraint = (caughtError.meta?.constraint as string) || ''
         console.log('# constraint', constraint)
         // Para constraints como "Order_clientId_fkey", extraer "Client"
         let model = ''
         const fkMatch = constraint.match(/\w+_(\w+)Id_fkey$/i)
         console.log('# fkMatch', fkMatch)

         if (fkMatch && fkMatch[1]) {
            // Capitalize first letter to match model names in messages
            model = fkMatch[1].charAt(0).toUpperCase() + fkMatch[1].slice(1)
         }
         console.log('# model:', model)

         const foreignKeyMessage =
            FOREIGN_KEY_CONSTRAINT_MESSAGES[model] ||
            'La referencia a otro recurso no es válida'

         return res.status(400).send({
            message: foreignKeyMessage,
            code: 'FOREIGN_KEY_CONSTRAINT',
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
