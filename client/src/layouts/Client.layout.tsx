import { Outlet } from 'react-router-dom'
import Navbar from './components/NavbarClient'

const ClientLayout = () => {
   return (
      <div className="font-inter bg-gray-50 min-h-dvh">
         <Navbar />

         <main className="container space-y-6 mx-auto px-4 py-8">
            <Outlet />
         </main>
      </div>
   )
}
export default ClientLayout
