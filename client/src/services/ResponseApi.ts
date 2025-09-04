import type { Order, OrderSummary } from '@models/Order.model'
import type { Article, ArticleCategory } from '@models/Article.model'

export interface ResponseApi {
   message: string
   page: number
   pageSize: number
   count: number

   article: Article
   articles: Article[]
   order: Order
   orders: Order[]
   ordersSummary: OrderSummary[]
   category: ArticleCategory
   categories: Record<string, string>
}
