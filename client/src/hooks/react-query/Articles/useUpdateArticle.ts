import { useMutation, useQueryClient } from '@tanstack/react-query'
import { extractErrorData } from '@utils/extractErrorDetails'
import { updateArticle } from '@services/articles.service'
import { queriesKeys } from '@config/reactQueryKeys'
import type { Article } from '@models/Article.model'
import { routesConfig } from '@config/routesConfig'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

const useUpdateArticle = () => {
   const navigate = useNavigate()
   const queryClient = useQueryClient()

   const { mutateAsync: updateArticleMutate, isPending } = useMutation({
      mutationFn: updateArticle,
      onSuccess: ({ message, article }) => {
         if (message === 'No hay cambios para aplicar') {
            toast.info(message)
         } else {
            toast.success(message)

            // solo es necesario invalidar la lista, el detalle se actualiza manualmente
            queryClient.invalidateQueries({ queryKey: [queriesKeys.FETCH_ARTICLES] })

            // se actualiza manualmente para evitar un refetch automatico apenas response la api y navegamos
            queryClient.setQueryData(
               [queriesKeys.FETCH_ARTICLE_DETAILS, article.id],
               (old: Article) => ({ ...old, article })
            )

            navigate(routesConfig.ADMIN_ARTICLE_LIST)
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
