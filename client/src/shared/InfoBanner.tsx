import { ChevronDown, Info } from 'lucide-react'
import { useState } from 'react'

interface InfoBannerProps {
   title: string
   description: string[]
}

const InfoBanner = ({ title, description }: InfoBannerProps) => {
   const [showBanner, setShowBanner] = useState(true)

   return (
      <div
         className="text-blue-800 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-600 rounded-r-md cursor-pointer transition-all duration-300"
         onMouseEnter={() => setShowBanner(true)}
         onMouseLeave={() => setShowBanner(false)}
         onClick={() => setShowBanner(!showBanner)}
      >
         <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
               <Info className="size-5 flex-shrink-0" />
               <h4 className="font-medium ">{title}</h4>
            </div>

            <ChevronDown
               className={`size-4 text-blue-600 transition-transform duration-300 ${
                  showBanner && 'rotate-180'
               }`}
            />
         </div>

         <div
            className={`overflow-hidden transition-all duration-300 ${
               showBanner ? 'max-h-96 ' : 'max-h-0'
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
