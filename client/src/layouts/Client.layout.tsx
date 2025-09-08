import { Outlet } from 'react-router-dom'
import Navbar from './components/NavbarClient'

const ClientLayout = () => {
   return (
      <div className="font-inter bg-gray-50 flex flex-col h-dvh">
         {/* Navbar fijo, no se mueve con el scroll */}
         <Navbar />

         {/* Contenedor con scroll, ocupa el resto del espacio */}
         <main className="overflow-auto mt-16">
            <div className="container mx-auto space-y-6 px-4 py-8">
               <Outlet />
            </div>
         </main>
      </div>
   )
}
export default ClientLayout
