import { getArticles, getArticlesByClient } from '@services/articles.service'
import { queriesKeys } from '@config/reactQueryKeys'
import { useQuery } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { toast } from 'sonner'

const useFetchArticles = (params?: { clientId?: string }) => {
   const { data, isPending, error, isError } = useQuery({
      queryKey: params?.clientId
         ? [queriesKeys.FETCH_ARTICLES, params.clientId]
         : [queriesKeys.FETCH_ARTICLES],
      queryFn: () =>
         params?.clientId ? getArticlesByClient(params.clientId) : getArticles(),
      staleTime: 20 * 60 * 1000, //20min
      retry: 1,
   })

   if (isError && error.message !== 'Network Error') {
      const axiosError = error as AxiosError<{
         message: string
         code: string
         details: { modelName: string; cause: string }
      }>

      const message = axiosError.response?.data.message || 'Error desconocido'

      toast.error(message, {
         id: `error-${queriesKeys.FETCH_ARTICLES}`,
      }) //Seteo un ID para evitar toast duplicados
   }

   return {
      articles: data?.articles || [],
      categories: data?.categories || {},
      isPending,
      isError,
      error,
   }
}

export default useFetchArticles
