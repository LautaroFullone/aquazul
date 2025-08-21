import { getOrdersClientStats } from '@services/orders.service'
import { useQuery } from '@tanstack/react-query'

const useFetchOrdersClientStats = (param: { clientId: string }) => {
   const { data, isPending, error, isError } = useQuery({
      queryKey: ['orders_stats', param.clientId],
      queryFn: () => getOrdersClientStats(param.clientId),
      staleTime: 20 * 60 * 1000, // 20 min
      retry: 1,
   })

   if (isError) {
      //toast.error(error.message)
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
