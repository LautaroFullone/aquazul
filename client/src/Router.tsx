import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AuthLayout from '@shared/AuthLayout/AuthenticationLayout'
import ClientLayout from '@shared/ClientLayout/ClientLayout'
import AdminLayout from '@shared/AdminLayout/AdminLayout'
import { routesConfig } from '@config/routesConfig'
import {
   AdminArticlesPanel,
   AdminDashboard,
   ClientDashboard,
   ClientOrderForm,
   ClientOrdersPanel,
   Login,
   NotFound,
   Register,
} from './pages'

const Router = () => {
   return (
      <BrowserRouter>
         <Routes>
            {/* Auth Routes */}
            <Route element={<AuthLayout />}>
               <Route path={routesConfig.LOGIN} element={<Login />} />
               <Route path={routesConfig.REGISTER} element={<Register />} />
            </Route>

            {/* Client Routes */}
            <Route path={routesConfig.CLIENT} element={<ClientLayout />}>
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

            {/* Admin Routes */}
            <Route path={routesConfig.ADMIN} element={<AdminLayout />}>
               <Route index element={<AdminDashboard />} />
               <Route
                  path={routesConfig.ADMIN_ARTICLES}
                  element={<AdminArticlesPanel />}
               />

               <Route path="*" element={<NotFound />} />
            </Route>

            <Route path="*" element={<Navigate to={routesConfig.LOGIN} />} />
         </Routes>
      </BrowserRouter>
   )
}
export default Router
