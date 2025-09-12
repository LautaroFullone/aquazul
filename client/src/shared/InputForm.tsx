import { OctagonAlert, type LucideIcon } from 'lucide-react'
import type { InputHTMLAttributes } from 'react'
import { Input, Skeleton } from '@shadcn'
import { Label } from '@shadcn'
import { cn } from '@shadcn'

interface InputFormProps extends InputHTMLAttributes<HTMLInputElement> {
   label?: string
   hasError?: boolean
   errorMessages?: string[]
   icon?: LucideIcon
   iconSide?: 'left' | 'right'
   labelClassName?: string
   isLoading?: boolean
}

const InputForm = ({
   label,
   hasError,
   errorMessages,
   icon: Icon,
   className,
   id,
   iconSide = 'left',
   isLoading = false,
   disabled,
   ...props
}: InputFormProps) => {
   return (
      <div className="space-y-1">
         {label && (
            <Label htmlFor={id} className="mb-1">
               {label}
            </Label>
         )}

         <div className="relative">
            {isLoading ? (
               <Skeleton className="w-full h-9" />
            ) : (
               <>
                  {Icon && (
                     <span
                        className={cn(
                           'absolute top-1/2 transform -translate-y-1/2 text-gray-500',
                           iconSide === 'left' ? 'left-3' : 'right-3'
                        )}
                     >
                        <Icon className="size-4" />
                     </span>
                  )}

                  <Input
                     id={id}
                     className={cn(
                        Icon && iconSide === 'left'
                           ? 'pl-8'
                           : iconSide === 'right'
                           ? 'pr-8'
                           : '',
                        hasError &&
                           'border-red-500 focus:border-0 focus-visible:ring-red-500',
                        className
                     )}
                     disabled={disabled || isLoading}
                     {...props}
                  />
               </>
            )}
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
