/**
 * Genera el siguiente código de artículo a partir del último código utilizado.
 *
 * @param lastCode - Último código de artículo utilizado
 * @returns Siguiente código de artículo
 */
export function nextArticleCode(lastCode?: string | undefined) {
   if (!lastCode) return 'ART-0001'

   const n = Number(lastCode.replace('ART-', ''))
   return `ART-${String(n + 1).padStart(4, '0')}`
}

/**
 * Genera el siguiente código de pedido a partir del último código utilizado.
 *
 * @param lastCode - Último código de pedido utilizado
 * @returns Siguiente código de pedido
 */
export function nextOrderCode(lastCode?: string | undefined) {
   if (!lastCode) return 'PED-000001'

   const n = Number(lastCode.replace('PED-', ''))
   return `PED-${String(n + 1).padStart(6, '0')}`
}
