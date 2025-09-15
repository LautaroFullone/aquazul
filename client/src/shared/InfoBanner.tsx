import { ChevronDown, Info, type LucideIcon } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@shadcn'
import { Button } from '@shadcn'
import ActionButton from './ActionButton'

interface InfoBannerProps {
   title: string
   description: string | string[]
   withDropdown?: boolean
   mode?: 'info' | 'error'
   primaryAction?: {
      icon: LucideIcon
      label: string
      onClick: () => void
      disabled?: boolean
      isLoading?: boolean
   }
   secondaryAction?: {
      label: string
      onClick: () => void
   }
   classname?: string
}

const InfoBanner = ({
   title,
   description,
   mode = 'info',
   withDropdown,
   primaryAction,
   secondaryAction,
   classname,
}: InfoBannerProps) => {
   const [showBanner, setShowBanner] = useState(false)
   const isOpen = withDropdown ? showBanner : true

   return (
      <div
         className={cn(
            `p-4 border-l-4 rounded-r-md ${
               mode === 'info'
                  ? 'text-blue-800 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-600'
                  : 'text-red-800 bg-gradient-to-r from-rose-50 to-red-50 border-red-600'
            }`,
            classname
         )}
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
            <div className="lg:flex lg:justify-between lg:items-start lg:gap-4">
               <div className="lg:flex-1">
                  {Array.isArray(description) ? (
                     <ul className="text-sm px-8 list-disc list-inside space-y-1 mt-2">
                        {description.map((item, index) => (
                           <li key={index}>{item}</li>
                        ))}
                     </ul>
                  ) : (
                     <p className="text-sm px-8 mt-2">{description}</p>
                  )}
               </div>

               {(primaryAction || secondaryAction) && (
                  <div className="flex flex-col md:flex-row gap-2 mt-3 px-8 lg:px-0 lg:mt-0 lg:flex-shrink-0 lg:min-w-fit">
                     {primaryAction && (
                        <ActionButton
                           variant={mode === 'info' ? 'primary' : 'destructive'}
                           icon={primaryAction.icon}
                           onClick={primaryAction.onClick}
                           disabled={primaryAction.disabled}
                           label={primaryAction.label}
                           isLoading={primaryAction.isLoading}
                        />
                     )}

                     {secondaryAction && (
                        <Button
                           variant="outline"
                           className="text-primary"
                           onClick={secondaryAction.onClick}
                        >
                           {secondaryAction.label}
                        </Button>
                     )}
                  </div>
               )}
            </div>
         </div>
      </div>
   )
}
export default InfoBanner
