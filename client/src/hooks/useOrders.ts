import type { OrderArticle } from '@models/Article.model'

const useOrders = () => {
   /**
    * Valida los artículos de un pedido antes de guardarlo y genera un array de errores.
    * @param orderArticles Lista de artículos del pedido.
    * @returns Lista de mensajes de error de validación.
    */
   const validateOrderArticles = (orderArticles: OrderArticle[]): string[] => {
      const errors: string[] = []
      const notSelectedCount = orderArticles.filter((a) => !a.articleId).length

      if (orderArticles.length === 0) {
         errors.push('Tenés que agregar al menos un artículo.')
      }
      if (notSelectedCount > 0) {
         errors.push(`${notSelectedCount} artículo(s) sin seleccionar.`)
      }
      return errors
   }

   return { validateOrderArticles }
}

export default useOrders
