import type { ResponseApi } from './ResponseApi'
import { api } from '@lib/axios'

type CreateArticleData = {
   name: string
   basePrice: number
   categoryId?: string
   categoryName?: string
   description: string
}

export async function createArticle(articleData: CreateArticleData) {
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
