import { Link, useLocation, useNavigate } from 'react-router-dom'
import { checkIsLinkActive } from '@utils/checkIsLinkActive'
import { routesConfig } from '@config/routesConfig'
import useMobile from '@hooks/useMobile'
import { Button, cn } from '@shadcn'
import { useState } from 'react'
import {
   ChartColumn,
   CircleDollarSign,
   ClipboardList,
   FileText,
   Home,
   LogOut,
   Menu,
   Receipt,
   Settings,
   UsersRound,
   WashingMachine,
} from 'lucide-react'

const navigationItems = [
   { label: 'Inicio', route: routesConfig.ADMIN_DASHBOARD, icon: Home },
   { label: 'Clientes', route: '/admin/testimonials', icon: UsersRound },
   { label: 'Pedidos', route: '/admin/posts', icon: WashingMachine },
   { label: 'Artículos', route: routesConfig.ADMIN_ARTICLE_LIST, icon: ClipboardList },
   { label: 'Precios', route: routesConfig.ADMIN_PRICES, icon: CircleDollarSign },
   { label: 'Remitos', route: '/admin/testimonials', icon: FileText },
   { label: 'Órdenes de pago', route: '/admin/testimonials', icon: Receipt },
   { label: 'Estadisticas', route: '/admin/testimonials', icon: ChartColumn },
   { label: 'Configuración', route: '/admin/config', icon: Settings },
]

const Sidebar = () => {
   const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

   const { pathname } = useLocation()
   const navigate = useNavigate()
   const isMobile = useMobile()

   return (
      <>
         {/* Header mobile */}
         {isMobile && (
            <div className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 shadow-xs h-16 px-4 py-3">
               <div className="flex items-center">
                  <Button
                     variant="ghost"
                     size="icon"
                     onClick={() => setMobileMenuOpen(true)}
                     className="hover:bg-gray-100"
                  >
                     <Menu className="h-5 w-5" />
                  </Button>

                  <img src="/banner-aquazul.png" alt="Logo" className="h-8 mt-1" />

                  <span className="px-2 bg-blue-800 text-white text-sm font-light rounded-sm ml-2">
                     ADMIN
                  </span>
               </div>
            </div>
         )}

         {/* Sidebar (siempre presente, oculto con translate en mobile) */}
         <aside
            className={cn(
               'fixed top-0 left-0 h-full z-50 w-64 bg-white border-r border-gray-200 text-gray-700 shadow-sm flex flex-col transform transition-transform duration-300',
               isMobile
                  ? mobileMenuOpen
                     ? 'translate-x-0'
                     : '-translate-x-full'
                  : 'relative translate-x-0 h-screen'
            )}
         >
            {/* Header con botón cerrar solo visible en mobile */}
            <div className="flex items-center justify-between h-16 px-2 border-b border-gray-200">
               <Link to="/" className="select-none">
                  <div className="flex items-center">
                     <img src="/banner-aquazul.png" alt="Logo" className="h-8 mt-1" />

                     <span className="px-2 bg-blue-800 text-white text-sm font-light rounded-sm ml-2">
                        ADMIN
                     </span>
                  </div>
               </Link>
            </div>

            <nav className="flex-1 p-2 space-y-1">
               {navigationItems.map(({ label, route, icon: Icon }) => {
                  const isActive = checkIsLinkActive(pathname, route)

                  return (
                     <Button
                        key={label}
                        variant={isActive ? 'secondary' : 'ghost'}
                        onClick={() => {
                           if (isMobile) setMobileMenuOpen(false)

                           navigate(route)
                        }}
                        className={cn(
                           'w-full justify-start select-none',
                           'hover:bg-blue-50! hover:text-blue-800',
                           isActive && 'bg-blue-800 hover:bg-blue-800 text-white'
                        )}
                     >
                        <Icon className="h-5! w-5!" />
                        {label}
                     </Button>
                  )
               })}
            </nav>

            <div className="p-4 border-t border-gray-200">
               <Button
                  variant="ghost"
                  className="w-full justify-start text-destructive hover:text-red-700 hover:bg-red-50!"
                  onClick={
                     isMobile
                        ? () => setMobileMenuOpen(false)
                        : () => navigate(routesConfig.CLIENT_DASHBOARD)
                  }
               >
                  <LogOut className="mr-2 h-4 w-4" />
                  Cerrar Sesión
               </Button>
            </div>
         </aside>

         {/* Backdrop solo en mobile */}
         {isMobile && mobileMenuOpen && (
            <div
               className="fixed inset-0 z-40 bg-black/40"
               onClick={() => setMobileMenuOpen(false)}
            />
         )}
      </>
   )
}

export default Sidebar
