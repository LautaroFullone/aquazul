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
   paymentNotes: PaymentNote[]
   deliveryNotes: DeliveryNote[]
}

export type OrderSummary = Pick<
   Order,
   'id' | 'code' | 'status' | 'articlesCount' | 'totalPrice' | 'createdAt'
>

interface PaymentNote {
   id: string
   createdAt: string
   updatedAt: string
}

interface DeliveryNote {
   id: string
   createdAt: string
   updatedAt: string
}
