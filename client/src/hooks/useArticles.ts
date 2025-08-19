import { queryOptions, useMutation } from '@tanstack/react-query'
import { getArticlesByClient } from '@services/articles.service'
import { createOrder } from '@services/orders.service'
import type { Order } from '@models/Order.model'

const useArticles = (clientId: Order['clientId']) => {
   const articlesQueryOptions = queryOptions({
      queryKey: ['articles'],
      queryFn: async () => {
         const response = await getArticlesByClient(clientId)
         return response.articles
      },
      staleTime: 30 * 60 * 1000, //30min
      retry: 1,
   })

   const { mutate: createOrderMutate, isPending: isCreationPending } = useMutation({
      mutationFn: createOrder,
      onSuccess: (data) => {
         console.log('Order created', data)
      },
      onError: (error) => {
         console.error(error.message)
      },
   })

   return { articlesQueryOptions, createOrderMutate, isCreationPending }
}

export default useArticles
