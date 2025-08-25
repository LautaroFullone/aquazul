import { getOrderDetails } from '@services/orders.service'
import { queriesKeys } from '@config/reactQueryKeys'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

const useFetchOrderDetails = (param: { orderId: string }) => {
   const { data, isPending, error, isError } = useQuery({
      queryKey: [queriesKeys.ORDER_DETAILS, param.orderId],
      queryFn: async () => {
         const response = await getOrderDetails(param.orderId)
         return response.order
      },
      enabled: Boolean(param.orderId),
      staleTime: 20 * 60 * 1000, // 20 min
      retry: 1,
   })

   if (isError && error.message !== 'Network Error') {
      toast.error(error.message, { id: `error-${queriesKeys.ORDER_DETAILS}` })
   }

   return {
      order: data || null,
      isPending,
      isError,
      error,
   }
}

export default useFetchOrderDetails
