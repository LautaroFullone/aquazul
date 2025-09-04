import { extractErrorData } from '@utils/extractErrorDetails'
import { getOrderDetails } from '@services/orders.service'
import { queriesKeys } from '@config/reactQueryKeys'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

const useFetchOrderDetails = (param: { orderId: string }) => {
   const { data, isPending, error, isError } = useQuery({
      queryKey: [queriesKeys.ORDER_DETAILS, param.orderId],
      queryFn: () => getOrderDetails(param.orderId),
      enabled: Boolean(param.orderId),
      staleTime: 20 * 60 * 1000, // 20 min
      retry: 1,
   })

   if (isError && error.message !== 'Network Error') {
      const { message } = extractErrorData(error)

      toast.error(message, { id: `error-${queriesKeys.ORDER_DETAILS}` })
   }

   return {
      order: data?.order || null,
      isPending,
      isError,
      error,
   }
}

export default useFetchOrderDetails
