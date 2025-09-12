import { useMutation, useQueryClient } from '@tanstack/react-query'
import { extractErrorData } from '@utils/extractErrorDetails'
import { updateArticle } from '@services/articles.service'
import { queriesKeys } from '@config/reactQueryKeys'
import { toast } from 'sonner'

const useUpdateArticle = () => {
   const queryClient = useQueryClient()

   const { mutateAsync: updateArticleMutate, isPending } = useMutation({
      mutationFn: updateArticle,
      onSuccess: ({ message }) => {
         if (message === 'No hay cambios para aplicar') {
            toast.info(message)
         } else {
            toast.success(message)
            queryClient.invalidateQueries({ queryKey: [queriesKeys.FETCH_ARTICLES] })
         }
      },
      onError: (error) => {
         if (error?.message === 'Network Error') return

         const { message } = extractErrorData(error)
         toast.error(message, {
            id: `error-${queriesKeys.UPDATE_ARTICLE}`,
         })
      },
   })

   return { updateArticleMutate, isPending }
}

export default useUpdateArticle
