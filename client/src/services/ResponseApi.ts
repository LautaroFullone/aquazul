import type { Order, OrderSummary } from '@models/Order.model'
import type { Article } from '@models/Article.model'

export interface ResponseApi {
   message: string
   page: number
   pageSize: number
   count: number
   categories: Record<string, string>

   article: Article
   articles: Article[]
   order: Order
   orders: Order[]
   ordersSummary: OrderSummary[]
}
