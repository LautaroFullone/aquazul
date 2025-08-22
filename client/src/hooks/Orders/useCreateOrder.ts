import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createOrder } from '@services/orders.service'
import { toast } from 'sonner'

const useCreateOrder = () => {
   const queryClient = useQueryClient()

   const { mutateAsync: createOrderMutate, isPending } = useMutation({
      mutationFn: createOrder,
      onSuccess: ({ message, order }) => {
         toast.success(message)

         queryClient.invalidateQueries({
            queryKey: ['orders_stats', order.clientId],
         })
         queryClient.invalidateQueries({
            queryKey: ['recent_orders', order.clientId],
         })
      },
      onError: (error) => {
         console.log(error)
         toast.error(error.message)
      },
   })

   return { createOrderMutate, isPending }
}

export default useCreateOrder
