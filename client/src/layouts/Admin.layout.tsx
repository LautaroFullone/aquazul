import Sidebar from './components/SidebarAdmin'
import { Outlet } from 'react-router-dom'

const AdminLayout = () => {
   return (
      <div className="font-inter bg-gray-50 flex flex-row min-h-dvh fixed inset-0">
         <Sidebar />

         <main className="flex-1 flex flex-col p-4 sm:p-8 overflow-x-hidden overflow-y-auto">
            <div className="pt-16 sm:pt-0 space-y-6">
               <Outlet />
            </div>
         </main>
      </div>
   )
}
export default AdminLayout
