/**
 * Verifica si hay cambios reales entre dos objetos.
 * Soporta campos planos y casos especiales como category.name vs categoryName.
 *
 * @param current - Objeto actual
 * @param next - Objeto con los cambios propuestos
 * @returns true si hay cambios reales, false en caso contrario
 */
export function hasRealChanges<T extends Record<string, any>>(
   current: T,
   next: Partial<T>
): boolean {
   for (const [key, value] of Object.entries(next)) {
      // si el campo no viene en el update o viene como undefined → ignorar
      if (!Object.prototype.hasOwnProperty.call(next, key)) continue
      if (value === undefined) continue

      // Caso especial para categoryName
      if (key === 'categoryName' && current.category && 'name' in current.category) {
         if (current.category.name !== value) {
            return true
         }
         continue
      }

      // comparación directa (cubre strings, números, enums)
      if (current[key as keyof T] !== value) {
         return true
      }
   }
   return false
}
