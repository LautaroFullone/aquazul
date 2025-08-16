import type { ResponseApi } from './ResponseApi'
import { api } from '@lib/axios'

export async function getArticlesByClient(clientId: string) {
   type Response = Pick<ResponseApi, 'message' | 'articles'>
   const { data } = await api.get<Response>(`/articles/client/${clientId}`)
   return data
}
