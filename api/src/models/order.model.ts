import { z } from 'zod'

export const orderStatusSchema = z.enum([
   'PENDING',
   'IN_PROGRESS',
   'COMPLETED',
   'CANCELLED',
])

export const getOrdersSchema = z.object({
   limit: z.coerce.number().int().positive().max(100).optional(),
   clientId: z.string().optional(),
})

const orderArticleSchema = z.object({
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

export const getOrdersStatsSchema = z.object({
   clientId: z.string().trim(),
})
