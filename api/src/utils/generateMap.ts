/**
 * Genera un mapa de categorías a partir de una lista de datos que contienen categorías.
 * [key: nombre de la categoría] => [value: su ID], ordenadas alfabéticamente por nombre.
 *
 * @param objectsList - Lista de objetos que contienen categorías
 * @returns Mapa de categorías
 */
export const generateCategoriesMap = <
   T extends { category?: { id?: string; name?: string } }
>(
   objectsList: T[]
) => {
   const seen = new Set<string>()
   const categories: { id: string; name: string }[] = []

   for (const a of objectsList) {
      const id = a.category?.id ?? ''
      const name = a.category?.name?.trim() ?? ''

      if (id && name && !seen.has(name)) {
         categories.push({ name, id })
         seen.add(name)
      }
   }

   // Ordenar alfabéticamente por nombre
   categories.sort((a, b) => a.name.localeCompare(b.name))

   return categories.reduce<Record<string, string>>((acc, cat) => {
      acc[cat.id] = cat.name
      return acc
   }, {})
}
