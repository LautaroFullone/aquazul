import { useMutation, useQueryClient } from '@tanstack/react-query'
import { extractErrorData } from '@utils/extractErrorDetails'
import { createOrder } from '@services/orders.service'
import { queriesKeys } from '@config/reactQueryKeys'
import { toast } from 'sonner'

const useCreateOrder = () => {
   const queryClient = useQueryClient()

   const { mutateAsync: createOrderMutate, isPending } = useMutation({
      mutationFn: createOrder,
      onSuccess: ({ message, order }) => {
         toast.success(message)

         queryClient.invalidateQueries({
            queryKey: [queriesKeys.ORDERS_STATS, order.clientId],
         })
         queryClient.invalidateQueries({
            queryKey: [queriesKeys.RECENTS_ORDERS, order.clientId],
         })
      },
      onError: (error) => {
         if (error?.message === 'Network Error') return

         const { message } = extractErrorData(error)
         toast.error(message, {
            id: `error-${queriesKeys.CREATE_ORDER}`,
         })
      },
   })

   return { createOrderMutate, isPending }
}

export default useCreateOrder
