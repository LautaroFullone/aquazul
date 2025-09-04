import { useMutation, useQueryClient } from '@tanstack/react-query'
import { extractErrorData } from '@utils/extractErrorDetails'
import { deleteArticle } from '@services/articles.service'
import type { Article } from '@models/Article.model'
import { queriesKeys } from '@config/reactQueryKeys'
import { toast } from 'sonner'

function useDeleteArticle() {
   const queryClient = useQueryClient()

   const { mutateAsync: deleteArticleMutate, isPending } = useMutation({
      mutationFn: deleteArticle,
      onSuccess: ({ message, article, category }) => {
         toast.success(message)

         //hay dos opciones, invalidar la querry o actualizar el cache manualmente
         // queryClient.invalidateQueries({ queryKey: [queriesKeys.FETCH_ARTICLES] })
         queryClient.setQueryData(
            [queriesKeys.FETCH_ARTICLES],
            (old: { articles: Article[]; categories: Record<string, string> }) => {
               if (!old) return old

               // Actualizar el array de artículos
               const updatedArticles = old.articles.filter(
                  (oldArticle) => oldArticle.id !== article.id
               )

               // Si se eliminó la categoría, también actualizar el array de categorías
               const updatedCategories = category
                  ? Object.fromEntries(
                       Object.entries(old.categories).filter(
                          ([keyId]) => keyId !== category.id
                       )
                    )
                  : old.categories

               return {
                  ...old,
                  articles: updatedArticles,
                  categories: updatedCategories,
               }
            }
         )
      },
      onError: (error) => {
         if (error?.message === 'Network Error') return

         const { message } = extractErrorData(error)
         toast.error(message)
      },
   })

   return { deleteArticleMutate, isPending }
}

export default useDeleteArticle
