import { X, type LucideIcon } from 'lucide-react'

interface EmptyBannerProps {
   title?: string
   description?: string
   icon?: LucideIcon
}

const EmptyBanner: React.FC<EmptyBannerProps> = ({
   title = 'No hay datos',
   description = 'Sin información disponible',
   icon: Icon,
}) => {
   return (
      <div className="text-center py-6 sm:py-8 px-4 border-2 border-dashed border-gray-200 rounded-md">
         <div className="flex flex-col items-center">
            <div className="max-w-sm flex flex-col items-center">
               <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  {Icon ? (
                     <Icon className="w-6 h-6 text-gray-400" />
                  ) : (
                     <X className="w-6 h-6 text-gray-400" />
                  )}
               </div>

               <p className="text-gray-500 font-medium mt-1">{title}</p>

               <p className="text-sm text-gray-400 text-wrap">{description}</p>
            </div>
         </div>
      </div>
   )
}
export default EmptyBanner
