import { ChevronDown, Info } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@shadcn'

interface InfoBannerProps {
   title: string
   description: string[]
   withDropdown?: boolean
   mode?: 'info' | 'error'
}

const InfoBanner = ({
   title,
   description,
   mode = 'info',
   withDropdown,
}: InfoBannerProps) => {
   const [showBanner, setShowBanner] = useState(false)
   const isOpen = withDropdown ? showBanner : true

   return (
      <div
         className={`p-4 border-l-4 rounded-r-md ${
            mode === 'info'
               ? 'text-blue-800 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-600'
               : 'text-red-800 bg-gradient-to-r from-rose-50 to-red-50 border-red-600'
         }`}
      >
         <div
            onClick={withDropdown ? () => setShowBanner((prev) => !prev) : undefined}
            className={cn(
               'flex items-center justify-between',
               withDropdown && 'cursor-pointer'
            )}
         >
            <div className="flex items-center gap-3">
               <Info className="size-5 flex-shrink-0" />
               <h4 className="font-medium ">{title}</h4>
            </div>

            {withDropdown && (
               <ChevronDown
                  className={`size-4 text-blue-600 transition-transform duration-300 ${
                     isOpen && 'rotate-180'
                  }`}
               />
            )}
         </div>

         <div
            className={`overflow-hidden transition-all duration-600! ${
               isOpen ? 'max-h-[500px]' : 'max-h-0'
            }`}
         >
            <ul className="text-sm px-8 list-disc list-inside space-y-1 mt-2">
               {description.map((item, index) => (
                  <li key={index}>{item}</li>
               ))}
            </ul>
         </div>
      </div>
   )
}
export default InfoBanner
