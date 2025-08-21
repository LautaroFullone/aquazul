import { getOrders, getClientStats } from '@services/orders.service'
import { queryOptions } from '@tanstack/react-query'

const useOrders = () => {
   const getOrdersQueryOptions = (queryParams: { clientId?: string; limit?: number }) =>
      queryOptions({
         queryKey: ['orders', queryParams],
         queryFn: async () => {
            const response = await getOrders(queryParams)
            return response.orders
         },
         staleTime: 30 * 60 * 1000, // 30 min
         retry: 1,
      })

   const getClientStatsQueryOptions = (param: { clientId: string }) =>
      queryOptions({
         queryKey: ['client_stats', param],
         queryFn: () => getClientStats(param.clientId),
         staleTime: 30 * 60 * 1000, // 30 min
         retry: 1,
      })

   return { getOrdersQueryOptions, getClientStatsQueryOptions }
}

export default useOrders
