import type { Article, ArticleCategory } from '@models/Article.model'
import type { Order, OrderSummary } from '@models/Order.model'
import type { Client } from '@models/Client.model'

export interface ResponseApi {
   message: string
   page: number
   pageSize: number
   count: number

   article: Article
   articles: Article[]
   order: Order
   orders: Order[]
   client: Client
   clients: Client[]
   ordersSummary: OrderSummary[]
   category: ArticleCategory
   categories: Record<string, string>
}
