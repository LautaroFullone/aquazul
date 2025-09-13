import { getArticleDetails } from '@services/articles.service'
import { extractErrorData } from '@utils/extractErrorDetails'
import { queriesKeys } from '@config/reactQueryKeys'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

const useFetchArticleDetails = (param: { articleId: string | undefined }) => {
   const { data, isPending, error, isError } = useQuery({
      queryKey: [queriesKeys.FETCH_ARTICLE_DETAILS, param.articleId],
      queryFn: () => getArticleDetails(param.articleId!),
      enabled: Boolean(param.articleId),
      staleTime: 20 * 60 * 1000, // 20 min
      retry: 1,
   })

   if (isError && error.message !== 'Network Error') {
      const { message } = extractErrorData(error)

      toast.error(message, { id: `error-${queriesKeys.FETCH_ARTICLE_DETAILS}` })
   }

   return {
      article: data?.article || null,
      isPending,
      isError,
      error,
   }
}

export default useFetchArticleDetails
