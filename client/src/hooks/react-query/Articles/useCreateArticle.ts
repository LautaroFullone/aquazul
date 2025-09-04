import { useMutation, useQueryClient } from '@tanstack/react-query'
import { extractErrorData } from '@utils/extractErrorDetails'
import { createArticle } from '@services/articles.service'
import type { Article } from '@models/Article.model'
import { queriesKeys } from '@config/reactQueryKeys'
import { toast } from 'sonner'

const useCreateArticle = () => {
   const queryClient = useQueryClient()

   const { mutateAsync: createArticleMutate, isPending } = useMutation({
      mutationFn: createArticle,
      onSuccess: ({ message, article }) => {
         toast.success(message)

         queryClient.setQueryData(
            [queriesKeys.FETCH_ARTICLES],
            (old: { articles: Article[]; categories: Record<string, string> }) => {
               if (!old) return old

               // Agregar el nuevo artículo al array
               const updatedArticles = [article, ...old.articles]

               let updatedCategories = old.categories

               // Si la categoría no existe en el objeto categories, agregarla
               if (article.category && !old.categories[article.category.id]) {
                  // Agregar la nueva categoría
                  updatedCategories = {
                     ...old.categories,
                     [article.category.id]: article.category.name,
                  }

                  // Ordenar las categorías alfabéticamente por nombre
                  const sortedEntries = Object.entries(updatedCategories).sort(
                     ([, aName], [, bName]) => aName.localeCompare(bName)
                  )

                  updatedCategories = Object.fromEntries(sortedEntries)
               }

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
         toast.error(message, {
            id: `error-${queriesKeys.CREATE_ARTICLE}`,
         })
      },
   })

   return { createArticleMutate, isPending }
}

export default useCreateArticle
