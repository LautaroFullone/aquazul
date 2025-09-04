import { useMutation, useQueryClient } from '@tanstack/react-query'
import { extractErrorData } from '@utils/extractErrorDetails'
import { createArticle } from '@services/articles.service'
import { queriesKeys } from '@config/reactQueryKeys'
import { toast } from 'sonner'

const useCreateArticle = () => {
   const queryClient = useQueryClient()

   const { mutateAsync: createArticleMutate, isPending } = useMutation({
      mutationFn: createArticle,
      onSuccess: ({ message }) => {
         toast.success(message)

         queryClient.invalidateQueries({
            queryKey: [queriesKeys.FETCH_ARTICLES],
         })
      },
      onError: (error) => {
         const { message } = extractErrorData(error)
         toast.error(message)
      },
   })

   return { createArticleMutate, isPending }
}

export default useCreateArticle
