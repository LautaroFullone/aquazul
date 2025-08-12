export const valueToCurrency = (value: string | number): string => {
   const num = typeof value === 'string' ? Number(value) : value

   const safeValue = isNaN(num) ? 0 : num

   return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 2, // fuerza 2 decimales
      maximumFractionDigits: 2,
   }).format(safeValue)
}
