import { getArticlesByClient } from '@services/articles.service'
import { useQuery } from '@tanstack/react-query'

const useArticles = (clientId: string) => {
   const { data, isPending, error, isError } = useQuery({
      queryKey: ['articles'],
      queryFn: async () => {
         const response = await getArticlesByClient(clientId)
         return response.articles
      },
      staleTime: 30 * 60 * 1000, //30min
      retry: 1,
   })

   return { articles: data || [], isPending, isError, error }
}

export default useArticles
