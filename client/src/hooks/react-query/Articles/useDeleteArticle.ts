import { useMutation, useQueryClient } from '@tanstack/react-query'
import { extractErrorData } from '@utils/extractErrorDetails'
import { toast } from 'sonner'

function useDeleteArticle() {
   const queryClient = useQueryClient()

   const { mutateAsync: deleteArticleMutate, isPending } = useMutation({
      mutationFn: deleteArticle,
      onSuccess: ({ message, article }) => {
         toast.success(message)

         queryClient.setQueryData(['articles'], (old: Article[]) =>
            old.filter((oldArticle) => oldArticle?.id !== article.id)
         )
      },
      onError: (error) => {
         const { message } = extractErrorData(error)
         toast.error(message)
      },
   })

   return { deleteArticleMutate, isPending }
}

export default useDeleteArticle
