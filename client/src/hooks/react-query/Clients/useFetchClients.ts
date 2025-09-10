import { extractErrorData } from '@utils/extractErrorDetails'
import { getClients } from '@services/clients.service'
import { queriesKeys } from '@config/reactQueryKeys'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

const useFetchClients = () => {
   const { data, isPending, error, isError } = useQuery({
      queryKey: [queriesKeys.FETCH_CLIENTS],
      queryFn: getClients,
      staleTime: 20 * 60 * 1000, //20min
      retry: 1,
   })

   if (isError && error.message !== 'Network Error') {
      const { message } = extractErrorData(error)

      toast.error(message, {
         id: `error-${queriesKeys.FETCH_CLIENTS}`,
      }) //Seteo un ID para evitar toast duplicados
   }

   return {
      clients: data?.clients || [],
      isPending,
      isError,
      error,
   }
}

export default useFetchClients
