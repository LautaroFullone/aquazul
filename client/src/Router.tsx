import { ClientDashboard, ClientOrderForm, ClientOrdersPanel, NotFound } from './pages'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ClientLayout from './shared/ClientLayout/ClientLayout'

const Router = () => {
   return (
      <BrowserRouter>
         <Routes>
            <Route path="/" element={<ClientLayout />}>
               <Route index element={<ClientDashboard />} />

               <Route path="pedidos">
                  <Route index element={<ClientOrdersPanel />} />
                  <Route path="formulario" element={<ClientOrderForm />} />
               </Route>

               <Route path="*" element={<NotFound />} />
            </Route>
         </Routes>
      </BrowserRouter>
   )
}
export default Router
