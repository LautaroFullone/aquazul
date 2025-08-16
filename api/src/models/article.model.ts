import { z } from 'zod'

export const articleCreateSchema = z.object({
   name: z.string().trim().min(1, 'El nombre es requerido'),
   basePrice: z.number().int().nonnegative('El precio debe ser un entero ≥ 0 (centavos)'),
})

export const articleUpdateSchema = z.object({
   name: z.string().trim().min(1).optional(),
   basePrice: z.number().int().nonnegative().optional(),
})
