import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import Router from './Router'
import './styles.css'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
   <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />

      <StrictMode>
         <Router />
      </StrictMode>
   </QueryClientProvider>
)
