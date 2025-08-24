import { getOrdersClientStats } from '@services/orders.service'
import { queriesKeys } from '@config/reactQueryKeys'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

const useFetchOrdersClientStats = (param: { clientId: string }) => {
   const { data, isPending, error, isError } = useQuery({
      queryKey: [queriesKeys.ORDERS_STATS, param.clientId],
      queryFn: () => getOrdersClientStats(param.clientId),
      staleTime: 20 * 60 * 1000, // 20 min
      retry: 1,
   })

   if (isError && error.message !== 'Network Error') {
      console.log('## error: ', error)
      //ID to avoid duplicated toasts
      toast.error(error.message, { id: `error-${queriesKeys.ORDERS_STATS}` })
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
