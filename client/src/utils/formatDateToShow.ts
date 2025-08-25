/**
 * Convierte un string/Date UTC a formato local configurable
 *
 * @param dateInput - Fecha en string o Date (UTC, ej: Supabase)
 * @param mode - "time" | "date" | "full"
 *    - "time": HH:mm (24hs)
 *    - "date": dd/MM/yyyy
 *    - "full": HH:mm - dd/MM/yyyy
 */
export function formatDateToShow(
   dateInput: string | Date | null | undefined,
   mode: 'time' | 'date' | 'full' = 'full'
) {
   if (!dateInput) return ''

   const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput

   const time = date.toLocaleTimeString('es-AR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
   })

   const day = date.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
   })

   switch (mode) {
      case 'time':
         return time
      case 'date':
         return day
      case 'full':
      default:
         return `${day} - ${time}hs`
   }
}
