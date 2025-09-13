import { getClientOrders, getOrders } from '@services/orders.service'
import { extractErrorData } from '@utils/extractErrorDetails'
import { queriesKeys } from '@config/reactQueryKeys'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

const useFetchOrders = (params?: { clientId?: string }) => {
   const { data, isLoading, error, isError } = useQuery({
      queryKey: params?.clientId
         ? [queriesKeys.FETCH_ORDERS, params.clientId]
         : [queriesKeys.FETCH_ORDERS],
      queryFn: () => (params?.clientId ? getClientOrders(params.clientId) : getOrders()),
      staleTime: 20 * 60 * 1000, // 20 min
      retry: 1,
   })

   if (isError && error.message !== 'Network Error') {
      const { message } = extractErrorData(error)

      toast.error(message, { id: `error-${queriesKeys.FETCH_ORDERS}` }) //Seteo un ID para evitar toast duplicados
   }

   return {
      orders: data?.ordersSummary || [],
      isLoading,
      isError,
      error,
   }
}

export default useFetchOrders
