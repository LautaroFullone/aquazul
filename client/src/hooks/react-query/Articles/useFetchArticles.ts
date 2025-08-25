import { getArticlesByClient } from '@services/articles.service'
import { queriesKeys } from '@config/reactQueryKeys'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

const useFetchArticles = (param: { clientId: string }) => {
   const { data, isPending, error, isError } = useQuery({
      queryKey: [queriesKeys.FETCH_ARTICLES],
      queryFn: async () => {
         const response = await getArticlesByClient(param.clientId)
         return response.articles
      },
      staleTime: 20 * 60 * 1000, //20min
      retry: 1,
   })

   if (isError && error.message !== 'Network Error') {
      toast.error(error.message, { id: `error-${queriesKeys.FETCH_ARTICLES}` }) //Seteo un ID para evitar toast duplicados
   }

   return {
      articles: data || [],
      isPending,
      isError,
      error,
   }
}

export default useFetchArticles
