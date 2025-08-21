import { getOrders } from '@services/orders.service'
import { useQuery } from '@tanstack/react-query'

const useFetchOrders = (queryParams: { clientId?: string }) => {
   const { data, isPending, error, isError } = useQuery({
      queryKey: queryParams?.clientId ? ['orders', queryParams.clientId] : ['orders'],
      queryFn: async () => {
         const response = await getOrders(queryParams)
         return response.orders
      },
      staleTime: 20 * 60 * 1000, // 20 min
      retry: 1,
   })

   if (isError) {
      //toast.error(error.message)
   }

   return {
      orders: data || [],
      isPending,
      isError,
      error,
   }
}

export default useFetchOrders
