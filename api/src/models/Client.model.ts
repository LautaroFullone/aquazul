import z from 'zod'
export interface ClientSummary {
   id: string
   name: string
   contactName: string
   address: string | null
   phone: string | null
   email: string | null
   category: {
      id: string
      name: string
   }
}

export const clientCreateSchema = z.object({
   name: z.string().trim().min(1, 'El nombre es requerido'),
   contactName: z.string().trim().min(1, 'El nombre de contacto es requerido'),
   address: z.string().trim().min(1, 'La dirección es requerida'),
   phone: z.string().trim().min(1, 'El teléfono es requerido'),
   email: z.string().trim().email('El email debe tener un formato válido'),
})

export const clientUpdateSchema = z.object({
   name: z.string().trim().min(1).optional(),
   contactName: z.string().trim().min(1).optional(),
   address: z.string().trim().min(1).optional(),
   phone: z.string().trim().min(1).optional(),
   email: z.email('El email debe tener un formato válido').optional(),
})
