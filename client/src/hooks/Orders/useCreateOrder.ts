import { createOrder } from '@services/orders.service'
import { useMutation, useQueryClient } from '@tanstack/react-query'

const useCreateOrder = () => {
   const queryClient = useQueryClient()

   const { mutateAsync: createOrderMutate, isPending } = useMutation({
      mutationFn: createOrder,
      onSuccess: ({ message, order }) => {
         //toast.success(data.message)

         queryClient.invalidateQueries({
            queryKey: ['orders_stats', order.clientId],
         })
         queryClient.invalidateQueries({
            queryKey: ['recent_orders', order.clientId],
         })
      },
      onError: (error) => {
         console.log(error)
         //const { message } = getApiError(error)
         //toast.error(message)
      },
   })

   return { createOrderMutate, isPending }
}

export default useCreateOrder
