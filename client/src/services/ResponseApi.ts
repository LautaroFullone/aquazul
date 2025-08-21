import type { Article } from '@models/Article.model'
import type { Order } from '@models/Order.model'

export interface ResponseApi {
   message: string
   page: number
   pageSize: number
   count: number

   article: Article
   articles: Article[]
   order: Order
   orders: Order[]
}
