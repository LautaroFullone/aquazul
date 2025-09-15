import type { ArticleFormData } from '@models/Article.model'
import type { ResponseApi } from './ResponseApi'
import { api } from '@lib/axios'

/**
 * Crear un nuevo artículo
 * @param articleData Datos del artículo a crear
 * @returns Mensaje de éxito y datos del artículo creado
 */
export async function createArticle(articleData: ArticleFormData) {
   type Response = Pick<ResponseApi, 'message' | 'article'>
   const { data } = await api.post<Response>(`/articles`, articleData)
   return data
}

/**
 * Actualizar un artículo existente
 * @param articleId ID del artículo a actualizar
 * @param articleData Datos del artículo a actualizar
 * @returns Mensaje de éxito y datos del artículo actualizado
 */
export async function updateArticle({
   articleId,
   articleData,
}: {
   articleId: string
   articleData: ArticleFormData
}) {
   type Response = Pick<ResponseApi, 'message' | 'article'>
   const { data } = await api.patch<Response>(`/articles/${articleId}`, articleData)
   return data
}

/**
 * Eliminar un artículo Y, si corresponde, también eliminar su categoría asociada
 * @param articleId ID del artículo a eliminar
 * @returns Mensaje de éxito y datos del artículo eliminado (y su categoría si se eliminó)
 */
export async function deleteArticle(articleId: string) {
   type Response = Pick<ResponseApi, 'message' | 'article' | 'category'>
   const { data } = await api.delete<Response>(`/articles/${articleId}`)
   return data
}

/**
 * Obtener todos los artículos y sus categorías del sistema
 * @returns Mensaje de éxito y datos de los artículos y sus categorías
 */
export async function getArticles() {
   type Response = Pick<ResponseApi, 'articles' | 'categories'>
   const { data } = await api.get<Response>(`/articles`)
   return data
}

/**
 * Obtener los detalles de un artículo específico
 * @param articleId ID del artículo a obtener
 * @returns Detalles del artículo
 */
export async function getArticleDetails(articleId: string) {
   type Response = Pick<ResponseApi, 'article'>

   const { data } = await api.get<Response>(`/articles/${articleId}`)
   return data
}

/**
 * Obtener artículos específicos para un cliente
 * @param clientId ID del cliente
 * @returns Mensaje de éxito y datos de los artículos y sus categorías
 */
export async function getArticlesByClient(clientId: string) {
   type Response = Pick<ResponseApi, 'articles' | 'categories'>
   const { data } = await api.get<Response>(`/articles/client/${clientId}`)
   return data
}

/**
 * Setear precios de múltiples artículos para un cliente específico
 * @param clientId ID del cliente
 * @param pricesMap Mapa de IDs de artículos y sus nuevos precios correspondientes
 * @returns Mensaje de éxito y datos de los artículos actualizados
 */
export async function setArticlesPricesByClient({
   clientId,
   pricesMap,
}: {
   clientId: string
   pricesMap: Record<string, number>
}) {
   type Response = Pick<ResponseApi, 'message' | 'articles' | 'clientId'>
   const { data } = await api.put<Response>(
      `/articles/prices/client/${clientId}`,
      pricesMap
   )
   return data
}
