import { z } from 'zod'

export const orderStatusSchema = z.enum([
   'PENDING',
   'IN_PROGRESS',
   'COMPLETED',
   'CANCELLED',
])

export const orderItemInputSchema = z.object({
   articleId: z.string().min(1),
   quantity: z.number().int().positive(),
})

export const orderCreateSchema = z.object({
   observation: z.string().trim().optional().nullable(),
   status: orderStatusSchema.optional(), // default server: 'PENDING'
   // clientId: z.string().trim().optional().nullable(),
   items: z.array(orderItemInputSchema).min(1),
})

export const orderUpdateSchema = z.object({
   observation: z.string().trim().optional().nullable(),
   status: orderStatusSchema.optional(),
})
