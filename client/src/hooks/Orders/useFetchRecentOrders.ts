import { queriesKeys } from '@config/reactQueryKeys'
import { getOrders } from '@services/orders.service'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

const useFetchRecentOrders = (queryParams: { clientId: string; limit: number }) => {
   const { data, isPending, error, isError } = useQuery({
      queryKey: [queriesKeys.RECENTS_ORDERS, queryParams.clientId],
      queryFn: async () => {
         const response = await getOrders(queryParams)
         return response.orders
      },
      staleTime: 20 * 60 * 1000, // 20 min
      retry: 1,
   })

   if (isError && error.message !== 'Network Error') {
      //ID to avoid duplicated toasts
      toast.error(error.message, { id: `error-${queriesKeys.RECENTS_ORDERS}` })
   }

   return {
      orders: data || [],
      isPending,
      isError,
      error,
   }
}

export default useFetchRecentOrders
