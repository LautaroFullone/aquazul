import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ClientLayout from './shared/ClientLayout/ClientLayout'
import { ClientDashboard, NotFound } from './pages'

const Router = () => {
   return (
      <BrowserRouter>
         <Routes>
            <Route path="/" element={<ClientLayout />}>
               <Route index element={<ClientDashboard />} />

               <Route path="*" element={<NotFound />} />
            </Route>
         </Routes>
      </BrowserRouter>
   )
}
export default Router
