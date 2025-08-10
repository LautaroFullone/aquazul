import { Outlet } from 'react-router-dom'
import Navbar from './components/Navbar'

const ClientLayout = () => {
   return (
      <div className="font-inter bg-gray-50 min-h-screen">
         <Navbar />

         <main className="container mx-auto px-4 py-8">
            <Outlet />
         </main>
      </div>
   )
}
export default ClientLayout
