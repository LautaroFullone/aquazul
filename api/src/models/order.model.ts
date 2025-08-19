import { z } from 'zod'

export const orderStatusSchema = z.enum([
   'PENDING',
   'IN_PROGRESS',
   'COMPLETED',
   'CANCELLED',
])

export const orderArticleSchema = z.object({
   articleId: z.string().min(1),
   clientPrice: z.number().positive(),
   quantity: z.number().int().positive(),
})

export const orderCreateSchema = z.object({
   clientId: z.string().trim(),
   observation: z.string().trim().optional(),
   status: orderStatusSchema.optional(), // default server: 'PENDING'
   articles: z.array(orderArticleSchema).min(1),
})
