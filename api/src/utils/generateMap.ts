import { ArticleSummary } from '../models/Article.model'

/**
 * Genera un mapa de categorías a partir de una lista de artículos.
 * [key: nombre de la categoría] => [value: su ID], ordenadas alfabéticamente por nombre.
 *
 * @param articles - Lista de artículos
 * @returns Mapa de categorías
 */
export const generateCategoriesMap = (articles: ArticleSummary[]) => {
   // Extraer categorías únicas
   const categories: { id: string; name: string }[] = []
   const seen = new Set<string>()
   for (const a of articles) {
      const id = a.category?.id ?? ''
      const name = a.category?.name?.trim() ?? ''
      if (id && name && !seen.has(name)) {
         categories.push({ name, id })
         seen.add(name)
      }
   }
   // Ordenar alfabéticamente por nombre
   categories.sort((a, b) => a.name.localeCompare(b.name))
   // Construir el mapa
   return categories.reduce<Record<string, string>>((acc, cat) => {
      acc[cat.id] = cat.name
      return acc
   }, {})
}
