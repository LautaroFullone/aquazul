export type OrderStatus = 'pending' | 'in_progress' | 'ready' | 'delivered' | 'cancelled'

export interface Order {
   id: string
   clientId: string
   status: OrderStatus
   items: { name: string; amount: number; price: string }[]
   observation: string
   totalPrice: string
   createdAt: string
}
