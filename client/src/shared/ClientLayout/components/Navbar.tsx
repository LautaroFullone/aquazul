import { Shirt, LogOut, Menu, UserRound } from 'lucide-react'
import { Link } from 'react-router-dom'
import {
   Button,
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
   Sheet,
   SheetContent,
   SheetTrigger,
} from '@shadcn'

const Navbar = () => {
   const navigationItems = [
      { route: '/', label: 'Inicio' },
      { route: '/nuevo-pedido', label: 'Nuevo Pedido' },
      { route: '/mis-pedidos', label: 'Mis Pedidos' },
   ]

   return (
      <header className="bg-white border-b border-gray-200 shadow-xs">
         <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
               <Link to="/cliente" className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                     <Shirt className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold text-gray-900">AQUAZUL</span>
               </Link>

               {/* Desktop Navigation */}
               <nav className="hidden md:flex items-center space-x-8">
                  {navigationItems.map((item, index) => (
                     <Link
                        key={`nav-link-${index}`}
                        to={item.route}
                        className="text-gray-600 hover:text-gray-900"
                     >
                        {item.label}
                     </Link>
                  ))}
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
                           onClick={() => window.alert('logout')}
                           className="text-red-600 cursor-pointer"
                        >
                           <LogOut className="mr-2 h-4 w-4 text-red-600" />
                           <span>Cerrar Sesión</span>
                        </DropdownMenuItem>
                     </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Mobile menu */}
                  <Sheet>
                     <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="md:hidden">
                           <Menu className="h-5 w-5" />
                        </Button>
                     </SheetTrigger>

                     <SheetContent side="right" className="w-64">
                        <div className="flex flex-col space-y-4 mt-8">
                           {navigationItems.map((item, index) => (
                              <Link
                                 key={`nav-link-mobile-${index}`}
                                 to={item.route}
                                 className="text-gray-600 hover:text-gray-900 py-2 px-4 rounded-md hover:bg-gray-100"
                              >
                                 {item.label}
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
