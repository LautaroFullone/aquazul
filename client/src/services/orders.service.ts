import type { Order, OrderSummary } from '@models/Order.model'
import type { ResponseApi } from './ResponseApi'
import { api } from '@lib/axios'

type CreateOrderData = Pick<Order, 'clientId' | 'articles' | 'observation'>

export async function createOrder(orderData: CreateOrderData) {
   type Response = Pick<ResponseApi, 'message' | 'order'>
   const { data } = await api.post<Response>(`/orders`, orderData)
   return data
}

type GetOrdersQueryParams = {
   clientId?: string
   limit?: number
}

export async function getOrders(queryParams?: GetOrdersQueryParams) {
   type Response = {
      message: string
      orders: OrderSummary[]
   }
   const { data } = await api.get<Response>(`/orders`, { params: queryParams })
   return data
}

export async function getOrderDetails(orderId: string) {
   type Response = {
      message: string
      order: Order | null
   }
   const { data } = await api.get<Response>(`/orders/${orderId}`)
   return data
}

export async function getOrdersClientStats(clientId: string) {
   type Response = {
      totalOrdersCount: number
      ordersInProgressCount: number
      ordersCompletedCount: number
      totalOrdersMonthPrice: number
   }
   const { data } = await api.get<Response>(`/orders/client/${clientId}/stats`)
   return data
}
