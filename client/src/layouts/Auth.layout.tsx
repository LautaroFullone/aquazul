import { Outlet } from 'react-router-dom'

const AuthLayout = () => {
   return (
      <div className="font-inter bg-gray-50">
         <main className="container mx-auto px-4 py-8 flex items-center justify-center min-h-dvh">
            <Outlet />
         </main>
      </div>
   )
}
export default AuthLayout
