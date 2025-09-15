import { setArticlesPricesByClient } from '@services/articles.service'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { extractErrorData } from '@utils/extractErrorDetails'
import { queriesKeys } from '@config/reactQueryKeys'
import { toast } from 'sonner'

const useSetArticleClientPrice = () => {
   const queryClient = useQueryClient()

   const { mutateAsync: setArticlesPricesByClientMutate, isPending } = useMutation({
      mutationFn: setArticlesPricesByClient,
      onSuccess: ({ message, clientId }) => {
         toast.success(message)

         queryClient.invalidateQueries({
            queryKey: [queriesKeys.FETCH_ARTICLES, clientId],
         })
      },
      onError: (error) => {
         if (error?.message === 'Network Error') return

         const { message } = extractErrorData(error)
         toast.error(message, {
            id: `error-${queriesKeys.SET_ARTICLE_CLIENT_PRICE}`,
         })
      },
   })

   return { setArticlesPricesByClientMutate, isPending }
}

export default useSetArticleClientPrice
