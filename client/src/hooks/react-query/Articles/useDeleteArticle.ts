import { useMutation, useQueryClient } from '@tanstack/react-query'
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
         console.log(error)
         toast.error(error.message)
      },
   })

   return { deleteArticleMutate, isPending }
}

export default useDeleteArticle
