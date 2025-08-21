import { getOrders, getClientStats } from '@services/orders.service'
import { queryOptions } from '@tanstack/react-query'

const useOrders = () => {
   const getOrdersQueryOptions = (params: {
      clientId?: string
      limit?: number
      page?: number
      pageSize?: number
   }) =>
      queryOptions({
         queryKey: ['orders', params],
         queryFn: async () => {
            const response = await getOrders(params)
            return response.orders
         },
         staleTime: 30 * 60 * 1000, // 30 min
         retry: 1,
      })

   const getClientStatsQueryOptions = (clientId: string) =>
      queryOptions({
         queryKey: ['client_stats', clientId],
         queryFn: () => getClientStats(clientId),
         staleTime: 30 * 60 * 1000, // 30 min
         retry: 1,
      })

   return { getOrdersQueryOptions, getClientStatsQueryOptions }
}

export default useOrders
