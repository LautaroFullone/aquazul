import Sidebar from './components/Sidebar'
import { Outlet } from 'react-router-dom'

const AdminLayout = () => {
   return (
      <div className="font-inter bg-gray-50 min-h-dvh">
         <Sidebar />

         <main className="container space-y-6 mx-auto px-4 py-8">
            <Outlet />
         </main>
      </div>
   )
}
export default AdminLayout
