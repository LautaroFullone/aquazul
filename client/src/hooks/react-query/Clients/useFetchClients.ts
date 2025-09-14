import { extractErrorData } from '@utils/extractErrorDetails'
import { getClients } from '@services/clients.service'
import { queriesKeys } from '@config/reactQueryKeys'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

const useFetchClients = () => {
   const { data, isLoading, error, isError } = useQuery({
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

   // const mockData = [
   //    {
   //       id: '1',
   //       name: 'Hotel Patagones',
   //       contactName: 'Luis Fullone',
   //       phone: '2236801937',
   //       email: 'luisroberto@gmail.com',
   //       address: 'Patagones 1607',
   //    },
   //    {
   //       id: 'cmfd6e4tb00011uwwe24xv450',
   //       name: 'Clinica Balcarce',
   //       contactName: 'Mirta Gaitero',
   //       phone: '2252900189',
   //       email: 'mirta.gaitero@gmail.com',
   //       address: 'Garay 3247',
   //    },
   // ]

   // return {
   //    clients: mockData,
   //    isLoading: false,
   //    isError,
   //    error,
   // }

   return {
      clients: data?.clients || [],
      isLoading,
      isError,
      error,
   }
}

export default useFetchClients
