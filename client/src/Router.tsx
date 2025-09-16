import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AdminLayout, AuthLayout, ClientLayout } from './layouts'
import { routesConfig } from '@config/routesConfig'
import {
   AdminArticlesPanel,
   AdminDashboard,
   ClientDashboard,
   ClientOrderForm,
   ClientOrdersPanel,
   AdminArticleForm,
   Login,
   NotFound,
   Register,
   AdminPricesPanel,
   AdminClientsPanel,
} from './pages'

const Router = () => {
   return (
      <BrowserRouter>
         <Routes>
            {/* AUTH Routes */}
            <Route element={<AuthLayout />}>
               <Route path={routesConfig.LOGIN} element={<Login />} />
               <Route path={routesConfig.REGISTER} element={<Register />} />
            </Route>

            {/* CLIENT Routes */}
            <Route path={routesConfig.CLIENT_DASHBOARD} element={<ClientLayout />}>
               <Route index element={<ClientDashboard />} />
               <Route
                  path={routesConfig.CLIENT_ORDER_HISTORY}
                  element={<ClientOrdersPanel />}
               />
               <Route
                  path={routesConfig.CLIENT_ORDER_NEW}
                  element={<ClientOrderForm />}
               />

               <Route path="*" element={<NotFound />} />
            </Route>

            {/* ADMIN Routes */}
            <Route path={routesConfig.ADMIN_DASHBOARD} element={<AdminLayout />}>
               <Route index element={<AdminDashboard />} />
               <Route
                  path={routesConfig.ADMIN_ARTICLE_LIST}
                  element={<AdminArticlesPanel />}
               />
               <Route
                  path={routesConfig.ADMIN_ARTICLE_NEW}
                  element={<AdminArticleForm />}
               />
               <Route
                  path={routesConfig.ADMIN_ARTICLE_EDIT}
                  element={<AdminArticleForm />}
               />
               <Route path={routesConfig.ADMIN_PRICES} element={<AdminPricesPanel />} />
               <Route path={routesConfig.ADMIN_CLIENTS} element={<AdminClientsPanel />} />

               <Route path="*" element={<NotFound />} />
            </Route>

            <Route path="*" element={<Navigate to={routesConfig.LOGIN} />} />
         </Routes>
      </BrowserRouter>
   )
}
export default Router
