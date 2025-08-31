import { ArticleSummary } from '../models/Article.model'

/**
 * Genera un mapa de categorías a partir de una lista de artículos.
 *
 * @param articles - Lista de artículos
 * @returns Mapa de categorías
 */
export const generateCategoriesMap = (articles: ArticleSummary[]) => {
   return articles.reduce<Record<string, string>>((acc, a) => {
      const id = a.category?.id ?? ''
      const name = a.category?.name?.trim() ?? ''
      if (id && name && !(name in acc)) acc[name] = id
      return acc
   }, {})
}
