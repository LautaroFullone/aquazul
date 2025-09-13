import { extractErrorData } from '@utils/extractErrorDetails'
import { getArticles } from '@services/articles.service'
import { queriesKeys } from '@config/reactQueryKeys'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

const useFetchArticles = () => {
   const { data, isLoading, error, isError } = useQuery({
      queryKey: [queriesKeys.FETCH_ARTICLES],
      queryFn: getArticles,
      staleTime: 20 * 60 * 1000, //20min
      retry: 1,
   })

   if (isError && error.message !== 'Network Error') {
      const { message } = extractErrorData(error)

      toast.error(message, {
         id: `error-${queriesKeys.FETCH_ARTICLES}`,
      }) //Seteo un ID para evitar toast duplicados
   }

   return {
      articles: data?.articles || [],
      categories: data?.categories || {},
      isLoading,
      isError,
      error,
   }
}

export default useFetchArticles
