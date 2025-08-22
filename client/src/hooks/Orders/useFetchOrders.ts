import { queriesKeys } from '@config/reactQueryKeys'
import { getOrders } from '@services/orders.service'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

const useFetchOrders = (queryParams: { clientId?: string }) => {
   const { data, isPending, error, isError } = useQuery({
      queryKey: queryParams?.clientId
         ? [queriesKeys.FETCH_ORDERS, queryParams.clientId]
         : [queriesKeys.FETCH_ORDERS],
      queryFn: async () => {
         const response = await getOrders(queryParams)
         return response.orders
      },
      staleTime: 20 * 60 * 1000, // 20 min
      retry: 1,
   })

   if (isError) {
      //ID to avoid duplicated toasts
      toast.error(error.message, { id: `error-${queriesKeys.FETCH_ORDERS}` })
   }

   return {
      orders: data || [],
      isPending,
      isError,
      error,
   }
}

export default useFetchOrders
