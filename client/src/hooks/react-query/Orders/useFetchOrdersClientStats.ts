import { getOrdersClientStats } from '@services/orders.service'
import { extractErrorData } from '@utils/extractErrorDetails'
import { queriesKeys } from '@config/reactQueryKeys'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

const useFetchOrdersClientStats = (params: { clientId: string }) => {
   const { data, isPending, error, isError } = useQuery({
      queryKey: [queriesKeys.ORDERS_STATS, params.clientId],
      queryFn: () => getOrdersClientStats(params.clientId),
      staleTime: 20 * 60 * 1000, // 20 min
      retry: 1,
   })

   if (isError && error.message !== 'Network Error') {
      const { message } = extractErrorData(error)

      toast.error(message, { id: `error-${queriesKeys.ORDERS_STATS}` }) //Seteo un ID para evitar toast duplicados
   }

   return {
      totalOrdersCount: data?.totalOrdersCount || 0,
      ordersInProgressCount: data?.ordersInProgressCount || 0,
      ordersCompletedCount: data?.ordersCompletedCount || 0,
      totalOrdersMonthPrice: data?.totalOrdersMonthPrice || 0,
      isPending,
      isError,
      error,
   }
}

export default useFetchOrdersClientStats
