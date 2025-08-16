import type { Article } from './Article.model'

export type OrderStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
export interface Order {
   id: string
   clientId: string
   status: OrderStatus
   articles: OrderArticle[] //JSON prisma
   observation: string
   totalPrice: string
   createdAt: string
}

export interface OrderArticle {
   articleId: Article['id']
   quantity: number
   clientPrice: number
}
