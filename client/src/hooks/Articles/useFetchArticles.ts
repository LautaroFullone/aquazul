import { getArticlesByClient } from '@services/articles.service'
import type { Order } from '@models/Order.model'
import { useQuery } from '@tanstack/react-query'

const useFetchArticles = (clientId: Order['clientId']) => {
   const { data, isPending, error, isError } = useQuery({
      queryKey: ['articles'],
      queryFn: async () => {
         const response = await getArticlesByClient(clientId)
         return response.articles
      },
      staleTime: 20 * 60 * 1000, //20min
      retry: 1,
   })

   if (isError) {
      //toast.error(error.message)
   }

   return {
      articles: data || [],
      isPending,
      isError,
      error,
   }
}

export default useFetchArticles
