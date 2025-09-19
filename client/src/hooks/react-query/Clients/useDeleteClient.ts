import { useMutation, useQueryClient } from '@tanstack/react-query'
import { extractErrorData } from '@utils/extractErrorDetails'
import { deleteClient } from '@services/clients.service'
import { queriesKeys } from '@config/reactQueryKeys'
import { toast } from 'sonner'

function useDeleteClient() {
   const queryClient = useQueryClient()

   const { mutateAsync: deleteClientMutate, isPending } = useMutation({
      mutationFn: deleteClient,
      onSuccess: ({ message }) => {
         toast.success(message)

         queryClient.invalidateQueries({ queryKey: [queriesKeys.FETCH_CLIENTS] })
         //TODO: INVALIDAR OTRAS QUERIES DE CLIENT COMO LAS DE STATS
      },
      onError: (error) => {
         if (error?.message === 'Network Error') return

         const { message } = extractErrorData(error)
         toast.error(message, {
            id: `error-${queriesKeys.DELETE_CLIENT}`,
         })
      },
   })

   return { deleteClientMutate, isPending }
}

export default useDeleteClient
