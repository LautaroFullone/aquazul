import { getArticlesByClient } from '@services/articles.service'
import { queriesKeys } from '@config/reactQueryKeys'
import type { Order } from '@models/Order.model'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

const useFetchArticles = (clientId: Order['clientId']) => {
   const { data, isPending, error, isError } = useQuery({
      queryKey: [queriesKeys.FETCH_ARTICLES],
      queryFn: async () => {
         const response = await getArticlesByClient(clientId)
         return response.articles
      },
      staleTime: 20 * 60 * 1000, //20min
      retry: 1,
   })

   if (isError) {
      //ID to avoid duplicated toasts
      toast.error(error.message, { id: `error-${queriesKeys.FETCH_ARTICLES}` })
   }

   return {
      articles: data || [],
      isPending,
      isError,
      error,
   }
}

export default useFetchArticles
