import { ClientDashboard, ClientOrderForm, ClientOrdersPanel, NotFound } from './pages'
import AuthenticationLayout from '@shared/AuthenticationLayout/AuthenticationLayout'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AdminDashboard from '@pages/Admin/Dashboard/AdminDashboard.page'
import ClientLayout from './shared/ClientLayout/ClientLayout'
import Register from '@pages/Authentication/Register.page'
import AdminLayout from '@shared/AdminLayout/AdminLayout'
import Login from '@pages/Authentication/Login.page'
import { routesConfig } from '@config/routesConfig'

const Router = () => {
   return (
      <BrowserRouter>
         <Routes>
            <Route path={routesConfig.CLIENT_DASHBOARD} element={<ClientLayout />}>
               <Route index element={<ClientDashboard />} />
               <Route
                  path={routesConfig.CLIENT_HISTORY_ORDERS}
                  element={<ClientOrdersPanel />}
               />
               <Route
                  path={routesConfig.CLIENT_NEW_ORDER}
                  element={<ClientOrderForm />}
               />

               <Route path="*" element={<NotFound />} />
            </Route>

            <Route path={routesConfig.ADMIN_DASHBOARD} element={<AdminLayout />}>
               <Route index element={<AdminDashboard />} />

               <Route path="*" element={<NotFound />} />
            </Route>

            <Route element={<AuthenticationLayout />}>
               <Route path={routesConfig.LOGIN} element={<Login />} />
               <Route path={routesConfig.REGISTER} element={<Register />} />
            </Route>

            <Route path="*" element={<Navigate to={routesConfig.LOGIN} />} />
         </Routes>
      </BrowserRouter>
   )
}
export default Router
