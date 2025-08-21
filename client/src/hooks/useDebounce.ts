import { useEffect, useState } from 'react'

/**
 * Retorna un valor "debounced": se actualiza solo cuando
 * pasaron X ms sin cambios.
 *
 * @param value valor que querés debounc-iar
 * @param delay tiempo en ms (por defecto 500)
 */
export function useDebounce<T>(value: T, delay = 500): T {
   const [debouncedValue, setDebouncedValue] = useState(value)

   useEffect(() => {
      const handler = setTimeout(() => setDebouncedValue(value), delay)

      return () => clearTimeout(handler)
   }, [value, delay])

   return debouncedValue
}
