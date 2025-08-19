import type { FieldErrors, UseFormRegisterReturn } from 'react-hook-form'
import type { TextareaHTMLAttributes } from 'react'
import { OctagonAlert } from 'lucide-react'
import { Textarea, Label, cn } from '@shadcn'

interface TextAreaFormProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
   name: string
   label?: string
   limit: number
   register?: UseFormRegisterReturn
   errors?: FieldErrors
}

const TextAreaForm: React.FC<TextAreaFormProps> = ({
   name,
   label,
   register,
   errors = {},
   placeholder,
   className = '',
   value = '',
   limit,
   ...props
}) => {
   // eslint-disable-next-line
   const fieldError = name.split('.').reduce((acc, key) => acc?.[key], errors as any)
   const hasError = !!fieldError

   return (
      <div className="space-y-2">
         {label && <Label htmlFor={`textarea-${name}`}>{label}</Label>}

         <Textarea
            id={`textarea-${name}`}
            placeholder={placeholder}
            className={cn(
               'mb-0',
               hasError ? 'border-red-500 focus:border-0 focus-visible:ring-red-500' : '',
               className
            )}
            maxLength={limit}
            value={value}
            {...register}
            {...props}
         />

         <div className="mt-1 text-xs text-zinc-500 text-right">
            {(value as string).length}/{limit}
         </div>

         {hasError && (
            <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
               <OctagonAlert size={13} />
               {fieldError.message}
            </p>
         )}
      </div>
   )
}

export default TextAreaForm
