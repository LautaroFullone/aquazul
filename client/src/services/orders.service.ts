import type { ResponseApi } from './ResponseApi'
import type { Order } from '@models/Order.model'
import { api } from '@lib/axios'

type CreateOrderData = Pick<Order, 'clientId' | 'articles' | 'observation'>

export async function createOrder(orderData: CreateOrderData) {
   type Response = Pick<ResponseApi, 'message'>
   const { data } = await api.post<Response>(`/orders`, orderData)
   return data
}
