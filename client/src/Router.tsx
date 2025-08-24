import AuthenticationLayout from '@shared/AuthenticationLayout/AuthenticationLayout'
import { ClientDashboard, ClientOrderForm, ClientOrdersPanel, NotFound } from './pages'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import ClientLayout from './shared/ClientLayout/ClientLayout'
import Register from '@pages/Authentication/Register.page'
import Login from '@pages/Authentication/Login.page'

const Router = () => {
   return (
      <BrowserRouter>
         <Routes>
            <Route path="/panel" element={<ClientLayout />}>
               <Route index element={<ClientDashboard />} />
               <Route path="historial-pedidos" element={<ClientOrdersPanel />} />
               <Route path="nuevo-pedido" element={<ClientOrderForm />} />

               <Route path="*" element={<NotFound />} />
            </Route>

            <Route path="/acceso" element={<AuthenticationLayout />}>
               <Route index element={<Login />} />
               <Route path="registro" element={<Register />} />
            </Route>

            <Route path="*" element={<Navigate to="/acceso" />} />
         </Routes>
      </BrowserRouter>
   )
}
export default Router
