import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@lib/queryClient'
import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import { Toaster } from 'sonner'
import Router from './Router'
import './styles.css'

createRoot(document.getElementById('root')!).render(
   <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />

      <StrictMode>
         <Router />
         <Toaster position="bottom-right" richColors />
      </StrictMode>
   </QueryClientProvider>
)
