import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ClientLayout from './shared/ClientLayout/ClientLayout'
import { ClientDashboard } from './pages'

const Router = () => {
   return (
      <BrowserRouter>
         <Routes>
            <Route path="/" element={<ClientLayout />}>
               <Route index element={<ClientDashboard />} />

               <Route
                  path="*"
                  element={
                     <div className="flex justify-center text-primary">404 Not Found</div>
                  }
               />
            </Route>
         </Routes>
      </BrowserRouter>
   )
}
export default Router
