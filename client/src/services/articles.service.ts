import type { ArticleFormData } from '@models/Article.model'
import type { ResponseApi } from './ResponseApi'
import { api } from '@lib/axios'

export async function createArticle(articleData: ArticleFormData) {
   type Response = Pick<ResponseApi, 'message' | 'article'>
   const { data } = await api.post<Response>(`/articles`, articleData)
   return data
}

export async function getArticles() {
   type Response = Pick<ResponseApi, 'articles' | 'categories'>
   const { data } = await api.get<Response>(`/articles`)
   return data
}

export async function getArticlesByClient(clientId: string) {
   type Response = Pick<ResponseApi, 'articles' | 'categories'>
   const { data } = await api.get<Response>(`/articles/client/${clientId}`)
   return data
}
