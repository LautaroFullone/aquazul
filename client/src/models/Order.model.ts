import type { Article } from './Article.model'

export type OrderStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
export interface Order {
   id: string
   code: string
   clientId: string
   status: OrderStatus
   observation: string
   articles: OrderArticle[] //JSON prisma
   articlesCount: number
   totalPrice: number
   createdAt: string
}

export interface OrderArticle {
   articleId: Article['id']
   quantity: number
   clientPrice: number
}
