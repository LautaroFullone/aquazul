import { FilePlus } from 'lucide-react'

const RecentOrderEmptyBanner = () => {
   return (
      <div className="text-center py-6 sm:py-8 px-4 border-2 border-dashed border-gray-200 rounded-md">
         <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
               <FilePlus className="w-6 h-6 text-gray-400" />
            </div>

            <p className="text-gray-500 font-medium">Todavía no tenés pedidos</p>

            <p className="text-sm text-gray-400">
               Hacé clic en &quot;Nuevo Pedido&quot; para crear el primero
            </p>
         </div>
      </div>
   )
}
export default RecentOrderEmptyBanner
