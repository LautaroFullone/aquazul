import { routesConfig } from '@config/routesConfig'
import { SearchX, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@shadcn'

const NotFound = () => {
   return (
      <div className="min-h-[calc(100dvh-theme(space.32))] flex items-center justify-center ">
         <div className="mx-auto max-w-lg text-center">
            <div className="mb-6 flex items-center justify-center">
               <SearchX className="h-20 w-20 text-zinc-500" aria-hidden="true" />
            </div>

            <h1 className="text-2xl font-semibold text-zinc-500">Página no encontrada</h1>

            <p className="mt-2 text-zinc-500">
               La ruta que buscas no existe, verificá la URL.
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
               <Link to={routesConfig.ADMIN_DASHBOARD}>
                  <Button
                     variant="ghost"
                     className="text-zinc-600 hover:text-zinc-700 hover:bg-zinc-100"
                  >
                     <ArrowLeft className="mr-2 h-4 w-4" />
                     Volver al Inicio
                  </Button>
               </Link>
            </div>
         </div>
      </div>
   )
}

export default NotFound
