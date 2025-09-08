import { History, Home, LogOut, Menu, UserRound, WashingMachine, X } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { checkIsLinkActive } from '@utils/checkIsLinkActive'
import { routesConfig } from '@config/routesConfig'
import { useState } from 'react'
import {
   Button,
   cn,
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from '@shadcn'

const navigationItems = [
   { label: 'Inicio', route: routesConfig.CLIENT_DASHBOARD, icon: Home },
   { label: 'Nuevo Pedido', route: routesConfig.CLIENT_ORDER_NEW, icon: WashingMachine },
   { label: 'Historial', route: routesConfig.CLIENT_ORDER_HISTORY, icon: History },
]

const Navbar = () => {
   const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
   const { pathname } = useLocation()
   const navigate = useNavigate()

   return (
      <>
         {/* Header siempre visible */}
         <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 shadow-xs h-16 px-4 py-3">
            <div className="container mx-auto sm:px-4">
               <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                     {/* Botón de menú solo visible en móvil */}
                     <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setMobileMenuOpen(true)}
                        className="md:hidden hover:bg-gray-100"
                     >
                        <Menu className="h-5 w-5" />
                     </Button>

                     <Link
                        to={routesConfig.CLIENT_DASHBOARD}
                        className="flex items-center space-x-2"
                     >
                        <img src="/aquazul-logo.png" className="h-8" alt="AQUAZUL Logo" />
                     </Link>
                  </div>

                  {/* Desktop Navigation - solo visible en desktop */}
                  <nav className="hidden md:flex items-center space-x-8">
                     {navigationItems.map(({ label, route }, index) => {
                        const isActive = checkIsLinkActive(pathname, route)

                        return (
                           <Link
                              key={`nav-link-${index}`}
                              to={route}
                              className={cn(
                                 'text-gray-700 hover:text-blue-800',
                                 isActive && 'text-blue-800 font-medium'
                              )}
                           >
                              {label}
                           </Link>
                        )
                     })}
                  </nav>

                  {/* User dropdown */}
                  <DropdownMenu>
                     <DropdownMenuTrigger asChild>
                        <Button
                           variant="ghost"
                           className="relative h-10 w-10 rounded-full"
                        >
                           <UserRound className="h-8 w-8" />
                        </Button>
                     </DropdownMenuTrigger>

                     <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                           <div className="flex flex-col space-y-1">
                              <p className="text-sm font-medium leading-none">
                                 Hotel Plaza Grande
                              </p>
                              <p className="text-xs leading-none text-muted-foreground">
                                 maria@hotelplaza.com
                              </p>
                           </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                           onClick={() => navigate(routesConfig.LOGIN)}
                           className="text-destructive! hover:bg-red-50 cursor-pointer"
                        >
                           <LogOut className="mr-2 size-4 text-destructive" />
                           <span>Cerrar Sesión</span>
                        </DropdownMenuItem>
                     </DropdownMenuContent>
                  </DropdownMenu>
               </div>
            </div>
         </header>

         {/* Mobile sidebar - solo aparece en mobile cuando se activa */}
         <aside
            className={cn(
               'md:hidden', // Oculto en desktop
               'fixed top-0 left-0 h-full z-70 w-64 bg-white border-r border-gray-200',
               'shadow-sm flex flex-col transform transition-transform duration-300 text-gray-700',
               mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
            )}
         >
            {/* Header del sidebar mobile */}
            <div className="flex items-center justify-between h-16 px-2 border-b border-gray-200">
               <div className="flex items-center space-x-2">
                  <img src="/aquazul-logo.png" alt="Logo" className="h-8" />
               </div>
               <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:bg-gray-100"
               >
                  <X className="h-5 w-5" />
               </Button>
            </div>

            {/* Navegación en el sidebar */}
            <nav className="flex-1 p-2 space-y-1">
               {navigationItems.map(({ label, route, icon: Icon }) => {
                  const isActive = checkIsLinkActive(pathname, route)

                  return (
                     <Button
                        key={label}
                        variant={isActive ? 'secondary' : 'ghost'}
                        onClick={() => {
                           setMobileMenuOpen(false)
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

            {/* Pie del sidebar */}
            <div className="p-4 border-t border-gray-200">
               <Button
                  variant="ghost"
                  className="w-full justify-start text-destructive hover:text-red-700 hover:bg-red-50!"
                  onClick={() => {
                     setMobileMenuOpen(false)
                     navigate(routesConfig.LOGIN)
                  }}
               >
                  <LogOut className="mr-2 h-4 w-4" />
                  Cerrar Sesión
               </Button>
            </div>
         </aside>

         {/* Backdrop para mobile - cierra el menú al hacer clic */}
         {mobileMenuOpen && (
            <div
               className="md:hidden fixed inset-0 z-60 bg-black/40"
               onClick={() => setMobileMenuOpen(false)}
            />
         )}
      </>
   )
}

export default Navbar

// <header className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 shadow-xs h-16 px-4 py-3">
//    <div className="container mx-auto sm:px-4">
//       <div className="flex justify-between ">
//          <Link
//             to={routesConfig.CLIENT_DASHBOARD}
//             className="flex items-center space-x-2"
//          >
//             <img src="/aquazul-logo.png" className="h-8" alt="AQUAZUL Logo" />
//          </Link>

//          {/* Desktop Navigation */}
//          <nav className="hidden md:flex items-center space-x-8">
//             {navigationItems.map(({ label, route }, index) => {
//                const isActive = pathname === route

//                return (
//                   <Link
//                      key={`nav-link-${index}`}
//                      to={route}
//                      className={cn(
//                         'text-gray-600 hover:text-gray-900',
//                         isActive && 'text-black'
//                      )}
//                   >
//                      {label}
//                   </Link>
//                )
//             })}
//          </nav>

//          <div className="flex items-center space-x-2 md:space-x-4">
//             <DropdownMenu>
//                <DropdownMenuTrigger asChild>
//                   <Button
//                      variant="ghost"
//                      className="relative h-10 w-10 rounded-full"
//                   >
//                      <UserRound className="h-8 w-8" />
//                   </Button>
//                </DropdownMenuTrigger>

//                <DropdownMenuContent className="w-56" align="end" forceMount>
//                   <DropdownMenuLabel className="font-normal">
//                      <div className="flex flex-col space-y-1">
//                         <p className="text-sm font-medium leading-none">
//                            Hotel Plaza Grande
//                         </p>
//                         <p className="text-xs leading-none text-muted-foreground">
//                            maria@hotelplaza.com
//                         </p>
//                      </div>
//                   </DropdownMenuLabel>
//                   <DropdownMenuSeparator />

//                   <DropdownMenuItem
//                      onClick={() => navigate(routesConfig.LOGIN)}
//                      className="text-destructive! hover:bg-red-50 cursor-pointer"
//                   >
//                      <LogOut className="size-4 text-destructive" />
//                      <span>Cerrar Sesión</span>
//                   </DropdownMenuItem>
//                </DropdownMenuContent>
//             </DropdownMenu>

//             {/* Mobile menu */}
//             <Sheet open={isSheetMobileOpen} onOpenChange={setIsSheetMobileOpen}>
//                <SheetTrigger asChild>
//                   <Button variant="ghost" size="icon" className="md:hidden">
//                      <Menu className="h-5 w-5" />
//                   </Button>
//                </SheetTrigger>

//                <SheetContent side="right" className="w-64">
//                   <SheetTitle className="sr-only">Menu</SheetTitle>
//                   <div className="flex flex-col space-y-4 mt-8">
//                      {navigationItems.map(({ label, route }, index) => (
//                         <Link
//                            key={`nav-link-mobile-${index}`}
//                            to={route}
//                            onClick={() => setIsSheetMobileOpen(false)}
//                            className="text-gray-600 hover:text-gray-900 py-2 px-4 rounded-md hover:bg-gray-100"
//                         >
//                            {label}
//                         </Link>
//                      ))}
//                   </div>
//                </SheetContent>
//             </Sheet>
//          </div>
//       </div>
//    </div>
// </header>
