import type { Order } from '@models/Order.model'
import type { ResponseApi } from './ResponseApi'
import { api } from '@lib/axios'

type CreateOrderData = Pick<Order, 'clientId' | 'articles' | 'observation'>

export async function createOrder(orderData: CreateOrderData) {
   type Response = Pick<ResponseApi, 'message' | 'order'>
   const { data } = await api.post<Response>(`/orders`, orderData)
   return data
}

export async function getOrders() {
   type Response = Pick<ResponseApi, 'ordersSummary'>

   const { data } = await api.get<Response>(`/orders`)
   return data
}

export async function getClientOrders(
   clientId: string,
   queryParams?: {
      limit: number
      orderBy?: 'createdAt' | 'updatedAt'
   }
) {
   type Response = Pick<ResponseApi, 'ordersSummary'>

   const { data } = await api.get<Response>(`/orders/client/${clientId}`, {
      params: queryParams,
   })
   return data
}

export async function getOrderDetails(orderId: string) {
   type Response = Pick<ResponseApi, 'order'>

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
