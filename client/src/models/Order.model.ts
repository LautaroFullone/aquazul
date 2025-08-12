export type OrderStatus = 'pending' | 'in_progress' | 'ready' | 'delivered' | 'cancelled'

export interface Order {
   id: string
   clientId: string
   status: OrderStatus
   articles: Article[]
   observation: string
   totalPrice: string
   createdAt: string
}

export interface Article {
   id: string
   name: string
   amount: number
   price: string
}
