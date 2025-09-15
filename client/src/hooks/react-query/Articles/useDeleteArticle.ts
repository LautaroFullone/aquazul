import { useMutation, useQueryClient } from '@tanstack/react-query'
import { extractErrorData } from '@utils/extractErrorDetails'
import { deleteArticle } from '@services/articles.service'
import { queriesKeys } from '@config/reactQueryKeys'
import { toast } from 'sonner'

function useDeleteArticle() {
   const queryClient = useQueryClient()

   const { mutateAsync: deleteArticleMutate, isPending } = useMutation({
      mutationFn: deleteArticle,
      onSuccess: ({ message }) => {
         toast.success(message)

         queryClient.invalidateQueries({ queryKey: [queriesKeys.FETCH_ARTICLES] })
      },
      onError: (error) => {
         if (error?.message === 'Network Error') return

         const { message } = extractErrorData(error)
         toast.error(message, {
            id: `error-${queriesKeys.DELETE_ARTICLE}`,
         })
      },
   })

   return { deleteArticleMutate, isPending }
}

export default useDeleteArticle
