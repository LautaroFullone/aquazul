import { Prisma } from '@prisma/client'

type CounterName = 'ARTICLE' | 'ORDER'

/** Prefijos para los diferentes tipos de contadores */
const MODEL_PREFIX: Record<CounterName, string> = {
   ARTICLE: 'ART',
   ORDER: 'PED',
}

/**
 * Obtiene el siguiente código de artículo o pedido desde la base de datos y lo incrementa.
 *
 * @param tx - Transacción de Prisma para realizar la operación
 * @param counterName - Nombre del contador ('ARTICLE' o 'ORDER')
 * @param pad - Cantidad de dígitos total del código
 * @returns Siguiente código formateado
 */
export async function getNextCode(
   tx: Prisma.TransactionClient,
   counterName: CounterName,
   pad: number
) {
   const { next } = await tx.codeCounterConfig.update({
      where: { name: counterName },
      data: { next: { increment: 1 } },
      select: { next: true },
   })
   const prefix = MODEL_PREFIX[counterName] || 'CODE-'

   return prefix + '-' + String(next - 1).padStart(pad, '0')
}
