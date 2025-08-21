import type { ResponseApi } from './ResponseApi'
import type { Order } from '@models/Order.model'
import { api } from '@lib/axios'

type CreateOrderData = Pick<Order, 'clientId' | 'articles' | 'observation'>

export async function createOrder(orderData: CreateOrderData) {
   type Response = Pick<ResponseApi, 'message'>
   const { data } = await api.post<Response>(`/orders`, orderData)
   return data
}

type GetOrdersQueryParams = {
   clientId?: string
   limit?: number
   page?: number
   pageSize?: number
}

export async function getOrders(queryParams?: GetOrdersQueryParams) {
   type Response = Pick<ResponseApi, 'message' | 'orders' | 'count'>
   const { data } = await api.get<Response>(`/orders`, { params: queryParams })
   return data
}

export async function getClientStats(clientId: string) {
   type Response = {
      totalOrdersCount: number
      ordersInProgressCount: number
      ordersCompletedCount: number
      totalOrdersMonthPrice: number
   }
   const { data } = await api.get<Response>(`/orders/client/${clientId}/stats`)
   return data
}
