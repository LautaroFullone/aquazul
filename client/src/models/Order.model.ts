import type { OrderArticle } from './Article.model'

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
   paymentNotes: []
   deliveryNotes: []
}

export type OrderSummary = Pick<
   Order,
   'id' | 'code' | 'status' | 'articlesCount' | 'totalPrice' | 'createdAt'
>
