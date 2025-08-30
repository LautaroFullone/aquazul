import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LogOut, Menu, UserRound } from 'lucide-react'
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
   Sheet,
   SheetContent,
   SheetTitle,
   SheetTrigger,
} from '@shadcn'

const navigationItems = [
   { label: 'Inicio', route: routesConfig.CLIENT },
   { label: 'Nuevo Pedido', route: routesConfig.CLIENT_NEW_ORDER },
   { label: 'Historial', route: routesConfig.CLIENT_HISTORY_ORDERS },
]

const Navbar = () => {
   const { pathname } = useLocation()
   const navigate = useNavigate()

   const [isSheetMobileOpen, setIsSheetMobileOpen] = useState(false)

   return (
      <header className="bg-white border-b border-gray-200 shadow-xs h-16 flex items-center">
         <div className="container mx-auto px-4">
            <div className="flex justify-between ">
               <Link to={routesConfig.CLIENT} className="flex items-center space-x-2">
                  <img src="/aquazul-logo.png" className="h-8" alt="AQUAZUL Logo" />
               </Link>

               {/* Desktop Navigation */}
               <nav className="hidden md:flex items-center space-x-8">
                  {navigationItems.map(({ label, route }, index) => {
                     const isActive = pathname === route

                     return (
                        <Link
                           key={`nav-link-${index}`}
                           to={route}
                           className={cn(
                              'text-gray-600 hover:text-gray-900',
                              isActive && 'text-black'
                           )}
                        >
                           {label}
                        </Link>
                     )
                  })}
               </nav>

               <div className="flex items-center space-x-2 md:space-x-4">
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
                           <LogOut className="mr-2 h-4 w-4 text-destructive" />
                           <span>Cerrar Sesión</span>
                        </DropdownMenuItem>
                     </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Mobile menu */}
                  <Sheet open={isSheetMobileOpen} onOpenChange={setIsSheetMobileOpen}>
                     <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="md:hidden">
                           <Menu className="h-5 w-5" />
                        </Button>
                     </SheetTrigger>

                     <SheetContent side="right" className="w-64">
                        <SheetTitle className="sr-only">Menu</SheetTitle>
                        <div className="flex flex-col space-y-4 mt-8">
                           {navigationItems.map(({ label, route }, index) => (
                              <Link
                                 key={`nav-link-mobile-${index}`}
                                 to={route}
                                 onClick={() => setIsSheetMobileOpen(false)}
                                 className="text-gray-600 hover:text-gray-900 py-2 px-4 rounded-md hover:bg-gray-100"
                              >
                                 {label}
                              </Link>
                           ))}
                        </div>
                     </SheetContent>
                  </Sheet>
               </div>
            </div>
         </div>
      </header>
   )
}

export default Navbar
