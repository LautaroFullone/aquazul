import { extractErrorData } from '@utils/extractErrorDetails'
import { getClientOrders } from '@services/orders.service'
import { queriesKeys } from '@config/reactQueryKeys'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

const useFetchRecentOrders = (params: {
   clientId: string
   limit: number
   orderBy: 'createdAt' | 'updatedAt'
}) => {
   const { data, isLoading, error, isError } = useQuery({
      queryKey: [queriesKeys.RECENTS_ORDERS, params.clientId],
      queryFn: () =>
         getClientOrders(params.clientId, {
            limit: params.limit,
            orderBy: params.orderBy,
         }),
      staleTime: 20 * 60 * 1000, // 20 min
      retry: 1,
   })

   if (isError && error.message !== 'Network Error') {
      const { message } = extractErrorData(error)
      toast.error(message, { id: `error-${queriesKeys.RECENTS_ORDERS}` }) //Seteo un ID para evitar toast duplicados
   }

   return {
      orders: data?.ordersSummary || [],
      isLoading,
      isError,
      error,
   }
}

export default useFetchRecentOrders
