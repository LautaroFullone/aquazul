import { Input } from '@shadcn'
import { Label } from '@shadcn'
import { cn } from '@shadcn'
import { OctagonAlert, type LucideIcon } from 'lucide-react'
import type { InputHTMLAttributes } from 'react'

interface InputFormProps extends InputHTMLAttributes<HTMLInputElement> {
   label?: string
   hasError?: boolean
   errorMessages?: string[]
   icon?: LucideIcon
   labelClassName?: string
}

const InputForm = ({
   label,
   hasError,
   errorMessages,
   icon,
   className,
   id,
   ...props
}: InputFormProps) => {
   const Icon = icon

   return (
      <div className="space-y-1">
         {label && (
            <Label htmlFor={id} className={cn('mb-1')}>
               {label}
            </Label>
         )}

         <div className="relative">
            {Icon && (
               <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  <Icon className="size-4" />
               </span>
            )}

            <Input
               id={id}
               className={cn(
                  icon && 'pl-8',
                  hasError && 'border-red-500 focus:border-0 focus-visible:ring-red-500',
                  className
               )}
               {...props}
            />
         </div>

         {hasError && errorMessages?.length && (
            <p className="mt-1 text-xs text-red-500 flex flex-col gap-1">
               {errorMessages.map((message, index) => (
                  <span className="flex flex-row gap-1" key={`error-${index}`}>
                     <OctagonAlert size={13} className="shrink-0" />
                     {message}
                  </span>
               ))}
            </p>
         )}
      </div>
   )
}

export default InputForm
