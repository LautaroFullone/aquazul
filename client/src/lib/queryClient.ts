import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export const queryClient = new QueryClient({
   queryCache: new QueryCache({
      onError: (error) => {
         if (error?.message === 'Network Error') {
            toast.error('Error de red: revisá tu conexión', { id: 'network-error' })
         }
      },
   }),
   mutationCache: new MutationCache({
      onError: (error) => {
         if (error?.message === 'Network Error') {
            toast.error('Error de red: revisá tu conexión', { id: 'network-error' })
         }
      },
   }),
})
