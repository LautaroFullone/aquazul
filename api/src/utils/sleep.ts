/**
 * Pausa la ejecución durante un tiempo determinado.
 *
 * @param ms - Tiempo en milisegundos
 * @returns Promesa que se resuelve después del tiempo especificado
 */
export function sleep(ms: number) {
   if (process.env.NODE_ENV !== 'production') {
      return new Promise((resolve) => setTimeout(resolve, ms))
   }

   return Promise.resolve()
}
