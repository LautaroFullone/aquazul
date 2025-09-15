import { z } from 'zod'

export interface ArticleSummary {
   name: string
   id: string
   basePrice: number
   code: string
   category: {
      name: string
      id: string
   }
}

export const articleCreateSchema = z.object({
   name: z.string().trim().min(1, 'El nombre es requerido'),
   basePrice: z.coerce.number().int().nonnegative('El precio debe ser un entero ≥ 0'),
   categoryName: z.string().trim().min(1, 'La categoria es requerida'),
})

export const articleUpdateSchema = z.object({
   name: z.string().trim().min(1).optional(),
   basePrice: z.number().int().nonnegative().optional(),
   categoryName: z.string().trim().optional(),
})

export const articlePriceByClientSchema = z.object({
   price: z.number().int().nonnegative('El precio debe ser un entero ≥ 0'),
})

export const articlePriceMapByClientSchema = z.record(z.string(), z.number().positive())
